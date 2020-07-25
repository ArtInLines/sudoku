const colors = require('colors');
colors.setTheme({
	log: ['green', 'italic'],
	success: ['cyan', 'italic'],
});

const mongoose = require('mongoose');

const connectDB = async () => {
	const conn = await mongoose.connect(
		`mongodb+srv://sudokuDB:o6hDM0kO5YMY@sudoku.gyqjc.mongodb.net/sudoku?authSource=admin&replicaSet=atlas-pp8i7n-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`,
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
		},
	);

	console.log(`MongoDB connected: ${conn.connection.host}`.success);
};

module.exports = connectDB;
