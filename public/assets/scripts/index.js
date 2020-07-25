// Get sudokus from DB via post("/sudokus")

const root = document.querySelector('#root');
const solveBtn = document.querySelector('#solveBtn');
const playerAmountEl = document.querySelector('.player-amount');
let sudoku, sudokuId;
import solve from './solve.js';
const socket = io();

socket.on('player-amount', (amount) => {
	if (amount < 2) return (playerAmountEl.innerHTML = '');
	playerAmountEl.innerHTML = `There are currently ${amount} players`;
});

socket.on('sudoku-change', (data) => {
	const element = document.getElementById(data.id);
	element.value = data.val;
});

socket.on('sudoku-focus', (data) => {
	const element = document.getElementById(data.id);
	const parent = element.parentNode;
	if (data.focus) {
		parent.style.borderColor = 'red';
	} else {
		parent.style.borderColor = '#555';
	}
});

socket.on('sudoku-solved', (bool) => {
	if (bool) solTrueDOM();
	else solFalseDOM();
});

document.addEventListener('keyup', (e) => {
	if (e.target.classList.contains('sudoku-square')) changeSudoku(e.target);
});

document.addEventListener('focusin', (e) => {
	if (e.target.classList.contains('sudoku-square')) changeFocus(e, true);
});

document.addEventListener('focusout', (e) => {
	if (e.target.classList.contains('sudoku-square')) changeFocus(e, false);
});

function changeFocus(e, bool) {
	socket.emit('sudoku-focus', { id: e.target.id, focus: bool });
}

function changeSudoku(element) {
	const regEx = /[0-9]/;
	if (element.value.length > 1) {
		element.value = element.value.split('').shift();
		return false;
	}
	if (!regEx.test(element.value)) {
		element.value = '';
	}
	socket.emit('sudoku-change', { id: element.id, val: element.value });
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
			square.innerHTML = `<input type="text" class="sudoku-square" id="sudoku-square-${i}-${j}" min="1" max="9" step="1" ${board[i][j] != 0 ? 'value="' + board[i][j] + '" disabled' : ''}>`;
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
	const userSol = getSol();
	for (let i = 0; i < solutions.length; i++) {
		if (solutions[i] == userSol) {
			solTrue();
			return;
		}
	}
	solFalse();
}

function getSol() {
	let sol = [];
	const board = document.querySelector('.sudoku-board');
	const rows = board.childNodes;
	for (let i = 0; i < rows.length; i++) {
		let arr = [];
		const squares = rows[i].childNodes;
		for (let j = 0; j < squares.length; j++) {
			const square = squares[i].firstChild;
			arr.push(square.value);
		}
		sol.push(arr);
	}
	return sol;
}

function solTrue() {
	solTrueDOM();
	socket.emit('sudoku-solved', { bool: true, id: sudokuId });
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
