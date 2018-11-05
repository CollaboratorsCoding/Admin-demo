const express = require('express');
const path = require('path');
const User = require('mongoose').model('User');

const admin = express.Router();
const expressStaticGzip = require('express-static-gzip');
const app1 = require('./app1/app1');
const adminApi = require('./api');

admin.use('/api', adminApi);
admin.use('/app1', app1);

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

// admin.use(express.static(path.join(__dirname, 'dist')))
admin.get('*', (req, res) => {
	res.sendFile(`${__dirname}/dist/index.html`);
});
/* Типа фича 1 */
// admin.use('/app1', app1);

/* GET admin application. */
// admin.get('*', function (req, res, next) { 	res.render('admin', { title:
// 'Admin' }); });

module.exports = admin;
