const colors = require('colors');
colors.setTheme({
	data: ['green', 'italic'],
	log: ['gray', 'italic', 'dim'],
	success: ['cyan', 'italic'],
	warn: ['yellow', 'bold'],
	error: ['red', 'italic', 'underline'],
});
require('dotenv').config({ path: `${__dirname}/config/config.env` });
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

// Constand variables
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const publicPath = `${__dirname}/public`;
const stylesPath = `${publicPath}/assets/styles`;
const scriptsPath = `${publicPath}/assets/scripts`;

// Configurations
app.use('/assets', express.static(`${publicPath}/assets`));
app.use('/styles', express.static(`${stylesPath}`));
app.use('/scripts', express.static(`${scriptsPath}`));
app.use(express.json());

// DB connection and model
const connectDB = require('./config/connectDB');
connectDB();
const sudokuModel = require('./models/sudoku');

///
// Socket.io
///
let playerAmount = 0,
	sudokuNum = 0,
	allSudokus;
io.on('connection', (socket) => {
	socket.emit('connect');
	playerAmount++;
	if (playerAmount > 1) emitPlayerAmount();

	socket.on('next-sudoku', (num) => {
		console.log(`Next sudoku`.warn);
		sudokuNum += num;
		if (sudokuNum == -1) sudokuNum = 0;
		console.log({ sudokuNum });
		getSudoku(sudokuNum, 1, true).then((obj) => {
			io.emit('next-sudoku', obj.sudoku);
		});
	});

	socket.on('sudoku-change', (data) => {
		socket.broadcast.emit('sudoku-change', data);
	});

	socket.on('sudoku-focus', (data) => {
		socket.broadcast.emit('sudoku-focus', data);
	});

	socket.on('sudoku-solved', (data) => {
		if (data.bool) {
			dbSudokuSolved(data.id);
			socket.broadcast.emit('sudoku-solved', true);
		} else {
			socket.broadcast.emit('sudoku-solved', false);
		}
	});

	socket.on('disconnect', () => {
		playerAmount--;
		emitPlayerAmount();
	});
});

function emitPlayerAmount() {
	io.emit('player-amount', playerAmount);
}

async function dbSudokuSolved(id) {
	const sudoku = await sudokuModel.findById(id);
	sudoku.solved = true;
	sudoku.save();
}

async function getSudoku(start = 0, amount = 1, solved = false) {
	let sudokus = [];
	for (let i = start, j = 0; j < amount; i++, j++) {
		console.log({ i, j });
		if (solved) {
			sudokus.push(allSudokus[i]);
			continue;
		}
		if (!allSudokus[i].solved) {
			sudokus.push(allSudokus[i]);
			continue;
		}
		j--;
	}
	console.log(`${sudokus.length} sudokus sent...`.gray.italic.dim);
	if (amount == 1) return sudokus[0];
	return sudokus;
}

app.get('/', (req, res) => {
	res.sendFile(`${publicPath}/index.html`);
})
	.get('/sudokus', async (req, res) => {
		// Send back json data with new sudokus, to create endless scrolling on client side
		const allSudokus = await sudokuModel.find();
		res.status(200).json({ success: true, data: allSudokus });
	})
	.get('/sudoku', async (req, res) => {
		const sudoku = await getSudoku(sudokuNum, 1, false);
		console.log(`Sending sudoku...`.warn);
		res.status(201).json({ success: true, data: sudoku });
	})
	.get('/create', async (req, res) => {
		// Create new sudokuModel in DB with all values set to empty
		// Redirect to /:sudokuId
		let board = [];
		for (let i = 0; i < 9; i++) {
			let row = [];
			for (let i = 0; i < 9; i++) {
				let square = null;
				row.push(square);
			}
			board.push(row);
		}
		const sudoku = await sudokuModel.create({ sudoku: board });
		res.status(201).json({ success: true, data: sudoku });
	})
	.get('/find/:sudokuId', async (req, res) => {
		// Get sudoku from req.params.sudokuId
		// Send sudoku as json
		const sudoku = await sudokuModel.findById(req.params.sudokuId);
		res.status(200).json({ success: true, data: sudoku.sudoku });
	})
	.get('/:sudokuId', async (req, res) => {
		// Send file, that doesn't allow you to edit the sudoku
		res.sendFile(`${publicPath}/index.html`);
	})
	.get('/:sudokuId/edit', async (req, res) => {
		// Send file, that allows to edit the sudoku
		res.sendFile(`${publicPath}/edit.html`);
	})
	.put('/:sudokuId/edit', async (req, res) => {
		// Update values of sudoku with given sudokuId
		// Data recceived should be the entire sudoku:
		// { sudoku: [...] }

		const sudoku = await sudokuModel.findByIdAndUpdate(req.params.sudokuId, { sudoku: req.body.sudoku }, { new: true });
		res.status(201).json({ success: true, data: sudoku });
	});

server.listen(PORT, console.log(`Server listening on port ${PORT} in ${NODE_ENV} mode...`.success));
getAllSudokus();

async function getAllSudokus() {
	console.log('Getting sudokus...'.gray.italic.dim);
	allSudokus = await sudokuModel.find();
	console.log(`${allSudokus.length} sudokus found and ready for access...`.success);
}
