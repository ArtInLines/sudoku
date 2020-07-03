// Import statement doesn't work
import main from 'solve.js';

const board = [
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

const result = main(board);

console.log(result.length);
