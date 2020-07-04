const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sudoku = new Schema({
    sudoku: String,
});

module.exports = mongoose.model('sudokuModel', sudoku);
