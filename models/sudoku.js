const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sudoku = new Schema({
    sudoku: Array,
    solved: Boolean,
});

module.exports = mongoose.model('sudokuModel', sudoku);
