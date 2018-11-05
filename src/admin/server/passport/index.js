const LocalStrategy = require('passport-local').Strategy;
const validate = require('../../../utils/validate').validate;
const genToken = require('../../../utils/generateToken').genToken;
const User = require('../models/user');
const UserTypes = require('../models/user.types');

const passportConfig = passport => {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

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
				const errors = validate(SignUpform, UserTypes.SignUpForm);

				if (errors.error) {
					// #TODO: changed to 'form' and handle on client errors from JOI ALL
					return done(
						{ type: 'server', message: errors.error, status: 401 },
						false
					);
				}

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
				const SignInform = { ...req.body };
				const errors = validate(SignInform, UserTypes.SignInForm);
				if (errors.error) {
					return done(
						{
							// #TODO: changed to 'form' and handle on client errors from JOI ALL
							type: 'server',
							message: errors.error,
							status: 401,
						},
						false
					);
				}
				return User.findOne({ email }, (err, user) => {
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
