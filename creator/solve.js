// Algorithm Explanation: https://www.youtube.com/watch?v=xySEHVUsCeM
// Code explanation: https://www.youtube.com/watch?v=3_50lwD7ygE

// Note:
// All coordinates are written (y, x)

const empty = 0;

let solutions = [];
let limit = 2;

function main(board) {
	// console.log('Solving...');
	solve(board);
	// console.log('solved');
	const results = solutions;
	// console.log('Results:', results.length);
	solutions = [];
	return results;
}

function solve(board) {
	// console.log('solve:', board);
	if (solved(board)) {
		solutions.push(board);
		// console.log('Board solved!\n', solutions);
	}
	if (solutions.length >= limit) {
		// console.log('solutions:', solutions.length);
		return;
	}
	const possibilities = nextBoards(board);
	const validBoards = keepOnlyValid(possibilities);
	// console.log('validBoards:', validBoards);
	return searchForSolution(validBoards);
}

function searchForSolution(boards) {
	// Check if the boards array is empty
	// empty array means: dead end
	if (boards.length < 1) {
		// if it is empty,
		// there are no valid boards,
		// because only valid boards get sent here
		// so we got a dead end
		return false;
	} else {
		// backtracking search for solution
		const first = boards.shift();
		const tryPath = solve(first);
		// tryPath lets us go one step deeper in the backtracking
		// if we hit a dead end, this function returns false
		// otherwise we go even deeper
		if (tryPath != false) {
			// no dead end yet
			return tryPath;
		} else {
			// we hit a dead end
			return searchForSolution(boards);
		}
	}
}

function solved(board) {
	// Check if any space in the board is empty
	// if so return false
	// otherwise return true
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (board[i][j] == empty) {
				return false;
			}
		}
	}
	return true;
}

function nextBoards(board) {
	// generate next nine possibilities
	let res = { y: 0, x: 0, boardsArray: [] };
	const firstEmpty = findEmptySquare(board); // returns a [y, x] coordinate || y = row || x = col
	if (firstEmpty != undefined) {
		res.y = firstEmpty[0];
		res.x = firstEmpty[1];
		for (let i = 1; i <= 9; i++) {
			let newBoard = [...board]; // Copy board
			let row = [...newBoard[res.y]]; // Copy row
			row[res.x] = i;
			newBoard[res.y] = row;
			res.boardsArray.push(newBoard);
		}
	}
	return res;
}

function findEmptySquare(board) {
	// given a board
	// return [y, x]
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (board[i][j] == empty) {
				return [i, j];
			}
		}
	}
}

// Filtering function
function keepOnlyValid(res) {
	const filteredBoards = [];
	for (let i = 0; i < res.boardsArray.length; i++) {
		// console.log('Checking if board is valid...');
		const tempBoard = validBoards(res.boardsArray[i], res.y, res.x);
		if (!tempBoard) continue;
		filteredBoards.push(tempBoard);
	}
	// console.log(filteredBoards);
	return filteredBoards;
}

function validBoards(board, y, x) {
	if (rowGood(board, y) && columnGood(board, y, x) && boxGood(board, y, x)) {
		// console.log('Board is valid');
		return board;
	}
	// console.log('Board is not valid');
	return false;
}

function rowGood(board, y) {
	// console.log('Checking row...');
	const row = [...board[y]];
	for (let i = 0; i < 9; i++) {
		// console.log(i);
		// if (row[i] == empty) continue;
		for (let j = i + 1; j < 9; j++) {
			// console.log('i:', row[i], 'j:', row[j]);
			if (row[i] == row[j] && row[i] != 0) {
				return false;
			}
		}
	}
	return true;
}

function columnGood(board, y, x) {
	// console.log('Checking Column...');
	const changedSquare = board[y][x];
	for (let i = 0; i < 9; i++) {
		if (i == y) continue;
		// Don't need to check for empty fields, cause board[y][x] can't be empty
		if (board[i][x] == board[y][x]) {
			// console.log('Column is not ok');
			return false;
		}
	}
	// console.log('Column is ok');
	return true;
}

function boxGood(board, y, x) {
	// y / x divided by 3 is either <1, <2 or <3
	// Math.floor of that result gives either 0, 1 or 2
	// Two loops inside one another:
	// One loops sideways 3 times 	- row	- row = 0 + ( 3 * Math.floor(y / 3) )
	// One loops downwards 3 times  - col	- col = 0 + ( 3 * Math.floor(x / 3) )
	// board[row][col] = current square
	// if (row == y && col == x) continue
	// if (board[row][col] == board[y][x]) return false
	// console.log('Checking box');
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

// Export statement doesn't work
module.exports = main;

// ##      ## //
// ## TEST ## //
// ##      ## //
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
// One solution
const testBoard3 = [
	[1, 0, 6, 0, 0, 2, 3, 0, 0],
	[0, 5, 0, 0, 0, 6, 0, 9, 1],
	[0, 0, 9, 5, 0, 1, 4, 6, 2],
	[0, 3, 7, 9, 0, 5, 0, 0, 0],
	[5, 8, 1, 0, 2, 7, 9, 0, 0],
	[0, 0, 0, 4, 0, 8, 1, 5, 7],
	[0, 0, 0, 2, 6, 0, 5, 4, 0],
	[0, 0, 4, 1, 5, 0, 6, 0, 9],
	[9, 0, 0, 8, 7, 4, 2, 1, 0],
];
// Invalid board
const testBoard4 = [
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

// console.log(main(testBoard3));
