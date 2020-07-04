const colors = require('colors');
colors.setTheme({
	log: ['green', 'italic'],
	success: ['cyan', 'italic'],
});

const mongoose = require('mongoose');

const connectDB = async () => {
	const conn = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sudoku.gyqjc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	});

	console.log(`MongoDB connected: ${conn.connection.host}`.success);
};

module.exports = connectDB;
