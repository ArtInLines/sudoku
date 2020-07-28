const root = document.querySelector('#root');
const solveBtn = document.querySelector('#solveBtn');
const playerAmountEl = document.querySelector('.player-amount');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
let sudoku, sudokuId;
import solve from './solve.js';
const socket = io();

socket.on('connect', () => {
	console.log('Socket connected');
});

socket.on('next-sudoku', (board) => {
	const oldBoard = document.querySelector('.sudoku-board');
	oldBoard.remove();
	console.table(board);
	const newBoard = buildSudoku(board);
	root.insertAdjacentElement('beforeend', newBoard);
	sudoku = board;
});

socket.on('player-amount', (amount) => {
	if (amount < 2) return (playerAmountEl.innerHTML = '');
	playerAmountEl.innerHTML = `There are currently ${amount} players`;
});

socket.on('sudoku-change', (data) => {
	const element = document.getElementById(data.id);
	element.value = data.val;
	changeClass(element.value, element);
});

socket.on('sudoku-focus', (data) => {
	const element = document.getElementById(data.id);
	const parent = element.parentNode;
	if (data.focus) {
		const focusedEl = document.createElement('div');
		focusedEl.classList.add('focusedEl');
		parent.insertAdjacentElement('beforeend', focusedEl);
	} else {
		parent.lastChild.remove();
	}
});

socket.on('sudoku-solved', (bool) => {
	if (bool) solTrueDOM();
	else solFalseDOM();
});

document.addEventListener('keyup', (e) => {
	if (e.keyCode >= 37 && e.keyCode <= 40) return;
	if (e.target.classList.contains('sudoku-square')) changeSudoku(e.target);
});

document.addEventListener('focusin', (e) => {
	if (e.target.classList.contains('sudoku-square')) changeFocus(e, true);
});

document.addEventListener('focusout', (e) => {
	if (e.target.classList.contains('sudoku-square')) changeFocus(e, false);
});

document.addEventListener('click', (e) => {
	if (e.target == nextBtn) nextSudoku(1);
	else if (e.target == prevBtn) nextSudoku(-1);
});

/* nextBtn.addEventListener('click', nextSudoku(1));
prevBtn.addEventListener('click', nextSudoku(-1)); */

function changeFocus(e, bool) {
	socket.emit('sudoku-focus', { id: e.target.id, focus: bool });
}

function nextSudoku(num) {
	console.warn('Next Sudoku');
	socket.emit('next-sudoku', num);
}

function changeSudoku(element) {
	const regEx = /[0-9]/;
	let arr = element.value.split('');
	element.value = '';
	if (regEx.test(arr[arr.length - 1])) {
		if (arr.length > 1) {
			if (arr[arr.length - 1] != ',') {
				arr.splice(-1, 0, ',');
			} else {
				arr.pop();
			}
		}
	} else {
		arr.pop();
	}
	changeClass(arr, element);
	for (let i = 0; i < arr.length; i++) {
		element.value += `${arr[i]}`;
	}
	socket.emit('sudoku-change', { id: element.id, val: element.value });
}

function changeClass(arr, element) {
	if (arr.length > 15) element.classList.add('smallest');
	else if (arr.length > 10) {
		element.classList.remove('smallest');
		element.classList.add('smaller');
	} else if (arr.length > 5) {
		element.classList.remove('smaller');
		element.classList.add('small');
	} else if (arr.length > 1) {
		element.classList.remove('small');
		element.classList.add('notes');
	} else {
		element.classList.remove('notes');
	}
}

function buildSudoku(board) {
	const parent = document.createElement('table');
	parent.classList.add('sudoku-board');
	for (let i = 0; i < 9; i++) {
		const row = document.createElement('tr');
		row.classList.add('sudoku-row');
		for (let j = 0; j < 9; j++) {
			const square = document.createElement('td');
			square.classList.add('sudoku-square-container');
			if ((i + 1) % 3 == 0 && i != 8) square.classList.add('bottom-border');
			if ((j + 1) % 3 == 0 && j != 8) square.classList.add('side-border');
			square.innerHTML = `<input type="text" class="sudoku-square" id="sudoku-square-${i}-${j}" min="1" max="9" step="1" ${
				board[i][j] != 0 ? 'value="' + board[i][j] + '" readonly="readonly"' : ''
			}>`;
			row.insertAdjacentElement('beforeend', square);
		}
		parent.insertAdjacentElement('beforeend', row);
	}
	return parent;
}

fetch('/sudoku')
	.then((res) => res.json())
	.then((data) => {
		if (!data.success) return; // TODO: Error Handling
		sudoku = data.data.sudoku;
		sudokuId = data.data._id;
		console.table(sudoku);
		const board = buildSudoku(sudoku);
		root.insertAdjacentElement('beforeend', board);
	});

solveBtn.addEventListener('click', checkSol);

function checkSol() {
	const solutions = solve(sudoku);
	console.table(solutions[0]);
	const userSol = getSol();
	console.table(userSol);
	for (let i = 0; i < solutions.length; i++) {
		if (compareSudokus(solutions[i], userSol)) {
			solTrue();
			return true;
		}
	}
	solFalse();
	return false;
}

function compareSudokus(arr, arr2) {
	for (let i = 0, len = arr.length; i < len; i++) {
		for (let j = 0, jen = arr[i].length; j < jen; j++) {
			if (arr[i][j] != arr2[i][j]) return false;
		}
	}
	return true;
}

function getSol() {
	let sol = [];
	const board = document.querySelector('.sudoku-board');
	const rows = board.childNodes;
	for (let i = 0; i < rows.length; i++) {
		let arr = [];
		const squares = rows[i].childNodes;
		for (let j = 0; j < squares.length; j++) {
			const square = squares[j].firstChild;
			if (square.value == '') arr.push(0);
			else arr.push(Number(square.value));
		}
		sol.push(arr);
	}
	return sol;
}

function solTrue() {
	solTrueDOM();
	socket.emit('sudoku-solved', { bool: true, id: sudokuId });
	console.log(true);
}
function solFalse() {
	solFalseDOM();
	socket.emit('sudoku-solved', { bool: false, id: sudokuId });
}

function solTrueDOM() {
	document.querySelector('.sudoku-board').style.borderColor = 'green';
}
function solFalseDOM() {
	document.querySelector('.sudoku-board').style.borderColor = 'red';
}
