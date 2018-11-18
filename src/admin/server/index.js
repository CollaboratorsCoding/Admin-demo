const express = require('express');
const path = require('path');
const User = require('mongoose').model('User');

const admin = express.Router();
const expressStaticGzip = require('express-static-gzip');
const adminApi = require('./api');

admin.use('/api', adminApi);

admin.get('/resetpassword', (req, res) => {
	User.findOne(
		{
			resetPasswordToken: req.query.token,
			resetPasswordExpires: { $gt: Date.now() },
		},
		(err, user) => {
			if (!user) {
				return res.redirect('/');
			}
			return res.sendFile(`${__dirname}/dist/index.html`);
		}
	);
});

admin.use(
	expressStaticGzip(path.join(__dirname, 'dist'), {
		enableBrotli: true,
	})
);

admin.get('*', (req, res) => {
	res.sendFile(`${__dirname}/dist/index.html`);
});


module.exports = admin;
