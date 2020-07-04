// Get sudokus from DB via post("/sudokus")

const root = document.querySelector('#root');

function showSudoku(board) {
	const parent = document.createElement('div');
	parent.classList.add('sudoku-board');
	for (let i = 0; i < 9; i++) {
		const row = document.createElement('div');
		row.classList.add('sudoku-row');
		for (let j = 0; j < 9; j++) {
			const square = document.createElement('div');
			let val = '<input type="number" class="sudoku-square" min="1" max="9" step="1">';
			if (board[i][j] != null) val = `${board[i][j]}`;
			square.innerHTML = val;
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
