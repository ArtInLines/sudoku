// Algorithm Explanation: https://www.youtube.com/watch?v=xySEHVUsCeM
// Code explanation: https://www.youtube.com/watch?v=3_50lwD7ygE

// Note:
// All coordinates are written (y, x)

const empty = null;
//               //
// <-- TESTS --> //
//               //
// Many solutions (46 solutions to be precise)
const board1 = [
	[5, empty, empty, empty, 7, empty, empty, empty, empty],
	[6, empty, empty, 1, 9, 5, empty, empty, empty],
	[empty, 9, 8, empty, empty, empty, empty, empty, empty],
	[empty, empty, empty, empty, empty, empty, empty, empty, 3],
	[4, empty, empty, 8, empty, 3, empty, empty, 1],
	[7, empty, empty, empty, 2, empty, empty, empty, empty],
	[empty, 6, empty, empty, empty, empty, 2, 8, empty],
	[empty, empty, empty, 4, 1, 9, empty, empty, 5],
	[empty, empty, empty, empty, 8, empty, empty, 7, 9],
];

// One solution
const board2 = [
	[5, 3, empty, empty, 7, empty, empty, empty, empty],
	[6, empty, empty, 1, 9, 5, empty, empty, empty],
	[empty, 9, 8, empty, empty, empty, empty, 6, empty],
	[8, empty, empty, empty, 6, empty, empty, empty, 3],
	[4, empty, empty, 8, empty, 3, empty, empty, 1],
	[7, empty, empty, empty, 2, empty, empty, empty, 6],
	[empty, 6, empty, empty, empty, empty, 2, 8, empty],
	[empty, empty, empty, 4, 1, 9, empty, empty, 5],
	[empty, empty, empty, empty, 8, empty, empty, 7, 9],
];

// Invalid board
const board3 = [
	[1, 2, 3, 4, 5, 6, 7, 8, empty],
	[empty, empty, empty, empty, empty, empty, empty, empty, 2],
	[empty, empty, empty, empty, empty, empty, empty, empty, 3],
	[empty, empty, empty, empty, empty, empty, empty, empty, 4],
	[empty, empty, empty, empty, empty, empty, empty, empty, 5],
	[empty, empty, empty, empty, empty, empty, empty, empty, 6],
	[empty, empty, empty, empty, empty, empty, empty, empty, 7],
	[empty, empty, empty, empty, empty, empty, empty, empty, 8],
	[empty, empty, empty, empty, empty, empty, empty, empty, 9],
];

let solutions = [];

function main(board) {
	solve(board);
	const results = solutions;
	solutions = [];
	return results;
}

function solve(board) {
	if (solved(board)) {
		solutions.push(board);
	}
	if (solutions.length >= 10) {
		return;
	}
	const possibilities = nextBoards(board);
	const validBoards = keepOnlyValid(possibilities);
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
	let res = [];
	const firstEmpty = findEmptySquare(board); // returns a (y, x) coordinate
	if (firstEmpty != undefined) {
		const y = firstEmpty[0];
		const x = firstEmpty[1];
		for (let i = 1; i <= 9; i++) {
			let newBoard = [...board];
			let row = [...newBoard[y]];
			row[x] = i;
			newBoard[y] = row;
			res.push(newBoard);
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
function keepOnlyValid(boards) {
	const filteredBoards = boards.filter((board) => validBoards(board));
	return filteredBoards;
}

function validBoards(board) {
	return rowGood(board) && columnGood(board) && boxesGood(board);
}

function rowGood(board) {
	for (let i = 0; i < 9; i++) {
		let tempRow = [];
		for (let j = 0; j < 9; j++) {
			if (tempRow.includes(board[i][j])) {
				// if it includes duplicates
				return false;
			} else if (board[i][j] != empty) {
				// if it's not a duplicate
				// and isn't empty
				tempRow.push(board[i][j]);
			}
		}
	}
	return true;
}

function columnGood(board) {
	// Different to rowGood() by having the indexes switched
	// so that it looks vertically, instead of horizontally
	for (let i = 0; i < 9; i++) {
		let tempRow = [];
		for (let j = 0; j < 9; j++) {
			if (tempRow.includes(board[j][i])) {
				// if it includes duplicates
				return false;
			} else if (board[j][i] != empty) {
				// if it's not a duplicate
				// and isn't empty
				tempRow.push(board[j][i]);
			}
		}
	}
	return true;
}

function boxesGood(board) {
	// Coordinates of the first box
	const boxCoordinates = [
		[0, 0],
		[0, 1],
		[0, 2],
		[1, 0],
		[1, 1],
		[1, 2],
		[2, 0],
		[2, 1],
		[2, 2],
	];

	for (let y = 0; y < 9; y += 3) {
		// Check first the highest boxes
		// Move 3 squares / 1 box down afterwards
		for (let x = 0; x < 9; x += 3) {
			// Same as outer loop
			// just moving 3 squares / 1 box horrizontally
			let temp = [];
			for (let i = 0; i < 9; i++) {
				let coordinates = [...boxCoordinates[i]];
				coordinates[0] += y;
				coordinates[1] += x;
				const currentSquare = board[coordinates[0]][coordinates[1]];
				// Check for duplicates in the box
				if (temp.includes(currentSquare)) {
					return false;
				} else if (currentSquare != empty) {
					temp.push(currentSquare);
				}
			}
		}
	}
	return true;
}

// ##      ## //
// ## TEST ## //
// ##      ## //
// console.log(main(board1).length);

// Export statement doesn't work
export default main;
