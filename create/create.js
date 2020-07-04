// Many solutions (46 solutions to be precise)
const testBoard1 = [
	[5, 0, 0, 0, 7, 0, 0, 0, 0],
	[6, 0, 0, 1, 9, 5, 0, 0, 0],
	[0, 9, 8, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 3],
	[4, 0, 0, 8, 0, 3, 0, 0, 1],
	[7, 0, 0, 0, 2, 0, 0, 0, 0],
	[0, 6, 0, 0, 0, 0, 2, 8, 0],
	[0, 0, 0, 4, 1, 9, 0, 0, 5],
	[0, 0, 0, 0, 8, 0, 0, 7, 9],
];
// One solution
const testBoard2 = [
	[5, 3, 0, 0, 7, 0, 0, 0, 0],
	[6, 0, 0, 1, 9, 5, 0, 0, 0],
	[0, 9, 8, 0, 0, 0, 0, 6, 0],
	[8, 0, 0, 0, 6, 0, 0, 0, 3],
	[4, 0, 0, 8, 0, 3, 0, 0, 1],
	[7, 0, 0, 0, 2, 0, 0, 0, 6],
	[0, 6, 0, 0, 0, 0, 2, 8, 0],
	[0, 0, 0, 4, 1, 9, 0, 0, 5],
	[0, 0, 0, 0, 8, 0, 0, 7, 9],
];
// Invalid board
const testBoard3 = [
	[1, 2, 3, 4, 5, 6, 7, 8, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 2],
	[0, 0, 0, 0, 0, 0, 0, 0, 3],
	[0, 0, 0, 0, 0, 0, 0, 0, 4],
	[0, 0, 0, 0, 0, 0, 0, 0, 5],
	[0, 0, 0, 0, 0, 0, 0, 0, 6],
	[0, 0, 0, 0, 0, 0, 0, 0, 7],
	[0, 0, 0, 0, 0, 0, 0, 0, 8],
	[0, 0, 0, 0, 0, 0, 0, 0, 9],
];

const solve = require('./solve.js');
const fs = require('fs');

let boardFile = fs.readFileSync('./board.json', { encoding: 'utf-8' });
let board = JSON.parse(boardFile).board;
let validSolutions = JSON.parse(boardFile).solution;

function create(limit) {
	for (let i = 0; i <= 100000; i++) {
		changeBoard();
		const solutions = solve(board);
		if (solutions.length == 0 || solutions.length > limit) {
			console.log(i, solutions.length);
			if (i % 50000 === 0 && i != 0) {
				console.log('\n\n -- Storing board -- \n\n');
				storeResult(board);
			}
			continue;
		} else {
			console.log('\n\n\n###   DONE   ###\n\n\n');
			validSolutions.push(solutions[0]);
			storeResult(board, validSolutions);
			return validSolutions;
		}
	}
	return null;
}

function storeResult(currentBoard, currentSolution = []) {
	const data = { board: currentBoard, solution: currentSolution };
	fs.writeFileSync('./board.json', JSON.stringify(data), { encoding: 'utf-8' });
}

function getCurrentValue() {
	let currentVal = 0;
	for (let i = 0; i < 81; i++) {
		const row = Math.floor(i / 9);
		const square = i % 9;
		currentVal += board[row][square] * Math.pow(10, i);
	}
	return currentVal;
}

function changeBoard() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (board[i][j] < 9) {
				board[i][j]++;
				return;
			} else {
				board[i][j] = 0;
			}
		}
	}
	return;
}

//				//
// Execute Code //
//				//
console.log(create(1), '\n\n\nDONE');
