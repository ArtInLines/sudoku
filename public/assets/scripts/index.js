// Get sudokus from DB via post("/sudokus")

const root = document.querySelector('#root');

const socket = io();

document.addEventListener('keyup', (e) => {
	if ((e.target.className = 'sudoku-square')) changeSudoku(e.target);
});

function changeSudoku(element) {
	regEx = /[0-9]/;
	if (!regEx.test(element.value)) {
		element.value = '';
		return false;
	}
	if (element.value.length > 1) {
		element.value = element.value.split('').shift();
		return false;
	}
}

function showSudoku(board) {
	const parent = document.createElement('table');
	parent.classList.add('sudoku-board');
	for (let i = 0; i < 9; i++) {
		const row = document.createElement('tr');
		row.classList.add('sudoku-row');
		for (let j = 0; j < 9; j++) {
			const square = document.createElement('td');
			square.innerHTML = `<input type="text" class="sudoku-square" min="1" max="9" step="1" ${board[i][j] != null ? 'value="' + board[i][j] + '" disabled' : ''}>`;
			square.classList.add('sudoku-square-container');
			row.insertAdjacentElement('beforeend', square);
		}
		parent.insertAdjacentElement('beforeend', row);
	}
	return parent;
}

fetch('/sudokus')
	.then((res) => res.json())
	.then((data) => {
		if (!data.success) return; // TODO: Error Handling
		const sudokus = data.data;
		for (let i = 0; i < sudokus.length; i++) {
			console.log(sudokus[i].sudoku);
			const board = showSudoku(sudokus[i].sudoku);
			root.insertAdjacentElement('beforeend', board);
		}
	});
