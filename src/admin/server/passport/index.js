const LocalStrategy = require('passport-local').Strategy;
const genToken = require('../../../utils/generateToken').genToken;
const User = require('../models/user');

const passportConfig = passport => {
	passport.use(
		'local.signup',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			(req, email, password, done) => {
				const SignUpform = { ...req.body };

				return User.findOne({ email }, (err, user) => {
					if (err) {
						return done({
							type: 'server',
							message: err,
							status: 500,
						});
					}
					if (user) {
						return done(
							{
								type: 'form',
								message: 'Email is already in use.',
								formData: {
									fieldName: 'email',
									fieldValue: email,
								},
								status: 401,
							},
							false
						);
					}
					const newUser = new User(SignUpform);
					newUser.verificationToken = genToken(60);
					return newUser.save(errs => {
						if (errs) {
							return done({
								type: 'server',
								message: errs,
								status: 500,
							});
						}
						return done(null, newUser);
					});
				});
			}
		)
	);

	passport.use(
		'local.signin',
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				passReqToCallback: true,
			},
			(req, email, password, done) => {
				User.findOne({ email }, (err, user) => {
					if (err) {
						return done(
							{
								type: 'server',
								message: err,
								status: 500,
							},
							false
						);
					}

					if (!user) {
						return done(
							{
								type: 'form',
								message: 'Email not found',
								formData: {
									fieldName: 'email',
									fieldValue: email,
								},
								status: 401,
							},
							false
						);
					}
					if (!user.validPassword(password)) {
						return done(
							{
								type: 'form',
								message: 'Wrong Password',
								formData: {
									fieldName: 'password',
									fieldValue: password,
								},
								status: 401,
							},
							false
						);
					}
					return done(null, user);
				});
			}
		)
	);
};

module.exports = passportConfig;
