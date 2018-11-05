const createError = require('http-errors');
const express = require('express');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const dbConnector = require('./db/db_connector');
require('dotenv').config();

dbConnector(process.env.DB_CONNECT);
const admin = require('./admin/server');

const passportConfig = require('./admin/server/passport');
const { socketInit } = require('./socketApi');

const app = express();

// info about helmet:
// https://expressjs.com/ru/advanced/best-practice-security.html
app.use(helmet());

app.use(express.json({ limit: '50mb' }));
app.use(
	express.urlencoded({
		limit: '50mb',
		extended: true,
		parameterLimit: 50000,
	})
);
app.use(logger('dev'));

app.use(cookieParser());
const sessionConfig = session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
	}),
	cookie: {
		maxAge: 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
})

app.use(sessionConfig);
socketInit(sessionConfig);
passportConfig(passport);
app.use(passport.initialize());

// app.use((req, res, next) => {
// 	res.locals.session = req.session;
// 	next();
// });

app.use('/', admin);

app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
