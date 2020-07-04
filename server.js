require('colors').setTheme({
	data: ['gray', 'italic', 'dim'],
	log: ['green', 'italic'],
	success: ['cyan', 'italic'],
	warn: ['yellow', 'bold'],
	error: ['red', 'italic', 'underline'],
});
require('dotenv').config({ path: `${__dirname}/config/config.env` });
const express = require('express');
const app = express();

// Constand variables
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const publicPath = `${__dirname}/public`;

// Configurations
app.use('/assets', express.static(`${publicPath}/assets`));
app.use(express.json());

// DB connection and model
const connectDB = require('./config/connectDB');
connectDB();
const sudokuModel = require('./models/sudoku');

app.get('/', (req, res) => {
	res.sendFile(`${publicPath}/index.html`);
})
	.get('/sudokus', async (req, res) => {
		// Send back json data with new sudokus, to create endless scrolling on client side
	})
	.get('/create', async (req, res) => {
		let board = [];
		for (let i = 0; i < 9; i++) {
			let;
		}
		const sudoku = await sudokuModel.create({ sudoku: board });
		// Create new sudokuModel in DB with all values set to empty
		// Redirect to /:sudokuId
	})
	.get('/find/:sudokuId', async (req, res) => {
		// Get sudoku from req.params.sudokuId
		// Send sudoku as json
	})
	.get('/:sudokuId', async (req, res) => {
		// Send file, that doesn't allow you to edit the sudoku
	})
	.get('/:sudokuId/edit', async (req, res) => {
		// Get sudoku from req.params.sudokuId
		// Send file, that allows to edit the sudoku
	})
	.put('/:sudokuId/edit', async (req, res) => {
		// Update values of sudoku with given sudokuId
	});

app.listen(PORT, console.log(`Server listening on port ${PORT} in ${NODE_ENV} mode...`.success));
