const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const expressSession = require('express-session');

const templateRoutes = require('./routes/template.routes.js');
const authRoutes = require('./routes/auth.routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
	expressSession({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true },
	})
);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

mongoose.connection.on('error', () => {
	throw new Error(`unable to connect to database`);
});
app.use('/', authRoutes);
app.use('/template', templateRoutes);

app.listen('5000', (err) => {});

module.exports = app;
