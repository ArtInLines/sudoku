const colors = require('colors');
colors.setTheme({
	log: ['green', 'italic'],
	success: ['cyan', 'italic'],
});

const mongoose = require('mongoose');

const connectDB = async () => {
	const conn = await mongoose.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sudoku.gyqjc.mongodb.net/${process.env.DB_NAME}?authSource=admin&replicaSet=atlas-pp8i7n-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`,
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
		},
	);

	console.log(`MongoDB connected: ${conn.connection.host}`.success);
};

module.exports = connectDB;
