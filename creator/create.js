const solve = require('./solve.js');
const fs = require('fs');

const EMPTYSQUAREMAX = 10;
let boardFile = fs.readFileSync('./board.json', { encoding: 'utf-8' });
let board = JSON.parse(boardFile).currentBoard;
let validSudokus = JSON.parse(boardFile).sudokus;

function create(limit, storingIntervall) {
	for (let i = 1; i < limit; i++) {
		changeBoard();
		if (i % storingIntervall === 0 && i != 0) {
			storeResult();
		}
		if (!checkForEmptyFields()) continue;
		// console.log(board);
		const solutions = solve(board);
		console.log(i, solutions.length);
		if (solutions.length == 0 || solutions.length > 1) {
			continue;
		} else {
			validSudokus.push({ sudoku: board, solution: solutions[0] });
			storeResult();
			console.log('\n\n\n  --  SUCCESS  --  \n\n\n');
			console.log('\n\n\n  --  Valid Sudoku created  --  \n\n\n');
			continue;
		}
	}
	storeResult();
	return null;
}

function storeResult() {
	console.log('\n\n  --  Storing board  --  \n\n');
	const data = { currentBoard: board, sudokus: validSudokus };
	fs.writeFileSync('./board.json', JSON.stringify(data), { encoding: 'utf-8' });
}

function checkForEmptyFields() {
	let emptyFields = 0;
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (board[row][col] == 0) {
				emptyFields++;
			}
			if (emptyFields == EMPTYSQUAREMAX) {
				// console.log('enough empty fields');
				return true;
			}
		}
	}
	// console.log('not enough empty fields');
	return false;
}

function changeBoard() {
	// console.log('Changing board');
	let added = false;
	for (let i = 0; i < 9; i++) {
		// console.log('Row:', i);
		for (let j = 0; j < 9; j++) {
			// console.log('Col:', j);
			// console.log('Square:', board[i][j]);
			// Add 1 to square or put it to 0 and let the loop continue
			if (board[i][j] < 9) {
				board[i][j]++;
				added = true;
				// console.log('Added one to square', board[i][j]);
			} else {
				board[i][j] = 0;
				// console.log('Square changed from 9 to 0');
			}

			// Check if number is already in row or column
			// If so, let loop continue
			if (board[i][j] != 0) {
				if (!rowGood(i, j) || !colGood(i, j) || !boxGood(i, j)) {
					// console.log('Row or Column not good');
					added = false;
					j--;
					continue;
				}
			}

			// If one was added, break free of loop
			if (added) {
				// console.log("Value was added, let's break free");
				return;
			}
		}
	}
	return;
}

function rowGood(row, col) {
	// Return false if row includes number already
	// return true otherwise
	// console.log('Checking Row...');
	let tempRow = [...board[row]];
	// console.log(tempRow);
	tempRow.splice(col, 1);
	// console.log(tempRow);
	if (tempRow.includes(board[row][col])) return false;
	return true;
}

function colGood(row, col) {
	// console.log('Checking Column...');
	// console.log(board[row]);
	// Return false if row includes number already
	// return true otherwise
	for (let i = 0; i < 9; i++) {
		// console.log('i:', i, '\nboard[i][col]:', board[i][col], '\nboard[row][col]', board[row][col]);
		if (i == row) continue;
		if (board[i][col] == board[row][col]) return false;
	}
	return true;
}

function boxGood(y, x) {
	const currentSquare = board[y][x];
	const rowStart = calcBoxStartingVal(y);
	const colStart = calcBoxStartingVal(x);
	for (let row = rowStart; row < rowStart + 3; row++) {
		for (let col = colStart; col < colStart + 3; col++) {
			// Don't need to check for empty squares, cause currentSquare can't be empty
			if (row == y && col == x) continue;
			if (board[row][col] == currentSquare) return false;
		}
	}
	// console.log('Box is ok');
	return true;
}

function calcBoxStartingVal(value) {
	value = value / 3;
	value = Math.floor(value);
	value = 3 * value;
	return value;
}

// Execute Code //
const startDate = Date.now();
const amount = 100000000;
const storingIntervall = 1000;
create(amount, storingIntervall);
const timeDiff = Date.now() - startDate;
console.log(`${timeDiff}ms \n${timeDiff / 60000}min`);
if (validSudokus.length != 0) console.log(`Found ${validSudokus.length} valid sudokus`);

//
//
//
//
//
/*
function getCurrentValue() {
	let currentVal = 0;
	for (let i = 0; i < 81; i++) {
		const row = Math.floor(i / 9);
		const square = i % 9;
		currentVal += board[row][square] * Math.pow(10, i);
	}
	return currentVal;
} 
*/

// TESTS //

/* // Many solutions (46 solutions to be precise)
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

const currentBoard = [
		[4, 0, 0, 0, 3, 6, 7, 8, 9],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
*/
