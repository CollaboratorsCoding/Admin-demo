const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');

const passport = require('passport');
const User = require('mongoose').model('User');
const Image = require('mongoose').model('Image');
const _ = require('lodash');
const genToken = require('../../../../utils/generateToken').genToken;
const sendEmail = require('../../../../utils/send-email');
const validate = require('../../../../utils/validate').validate;
const UserTypes = require('../../models/user.types');

const UserController = {};

UserController.signup = (req, res, next) => {
	passport.authenticate('local.signup', (error, user) => {
		if (error) {
			return res.status(error.status).json(error);
		}
		sendEmail({
			to: user.email,
			from: '<codenamevero@gmail.com>',
			subject: `[CodeNameVero] Verification email!`,
			template: 'verification',
			templateVars: {
				title: `Account verification!`,
				name: user.name,
				verifyUrl: `${req.protocol }://${req.host}/admin/api/verification?token=${
					user.verificationToken
				}`,
			},
		});
		return req.login(user, loginErr => {
			if (loginErr) return next(loginErr);
			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
			req.session.token = token;
			// req.session.adminData = {
			// 	name: user.name
			// }
			return res.send("ok")
		});
	})(req, res, next);
};

UserController.signin = (req, res, next) => {
	passport.authenticate('local.signin', (error, user) => {
		if (error) {
			return res.status(error.status).json(error);
		}
		return req.login(user, loginErr => {
			if (loginErr) return next(loginErr);
			const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
			req.session.token = token;
			// req.session.adminData = {
			// 	name: user.name
			// }
			return res.status(200).send("ok")	
		});
	})(req, res, next);
};

UserController.logout = (req, res) => {
	req.logout();
	req.session.token = null;
	// req.session.adminData = null;
	res.send("ok")
};

UserController.getprofile = (req, res) => {
	Image.findOne(
		{ parentCollection: 'users', parentId: req.user._id },
		'publicURL',
		(err, image) => {
			const userObject = req.user.toObject();
			userObject.imageURL = _.get(image, 'publicURL', undefined);
			res.json({
				user: _.omit(userObject, [
					'password',
					'verificationToken',
					'resetPasswordToken',
					'resetPasswordExpires',
				]),
				isLoggedIn: !!req.user,
			});
		}
	);
};

UserController.editProfile = (req, res) => {
	const restrictedFields = _.omit(req.body, ['name', 'age']);
	const key = Object.keys(req.body)[0];
	if (!_.isEmpty(restrictedFields)) {
		return res
			.status(403)
			.json({ type: 'server', message: 'Restricted field' });
	}
	const errors = validate(req.body[key], UserTypes.SignUpForm[key]);
	if (errors.error) {
		return res.status(403).json({ type: 'server', message: errors.error });
	}
	return User.findOneAndUpdate(
		{ _id: req.user._id },
		_.pick(req.body, ['name', 'age']),
		{ new: true },
		(err, user) => {
			if (err)
				return res.status(500).json({
					type: 'server',
					message: err,
				});
			return Image.findOne(
				{ parentCollection: 'users', parentId: user._id },
				'publicURL',
				(errs, image) => {
					const userObject = user.toObject();
					userObject.imageURL = _.get(image, 'publicURL', undefined);
					return res.json({
						user: _.omit(userObject, [
							'password',
							'verificationToken',
							'resetPasswordToken',
							'resetPasswordExpires',
						]),
						requestSuccess: {
							message: 'Profile updated',
							operation: 'user_edit',
						}
					});
				}
			)
		}
	);
};

UserController.getuserprofile = (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err)
			return res.status(500).json({
				type: 'server',
				message: err,
			});
		if (!user)
			return res.status(404).json({
				type: 'server',
				message: 'User not found',
			});

		return Image.findOne(
			{ parentCollection: 'users', parentId: user._id },
			'publicURL',
			(errs, image) => {
				const userObject = user.toObject();
				userObject.imageURL = _.get(image, 'publicURL', undefined);
				return res.json({
					userPageData: _.pick(userObject, ['_id', 'imageURL', 'name', 'age']),
				});
			}
		)
	});
};

UserController.verification = (req, res) => {
	User.findOne({ verificationToken: req.query.token }, (err, user) => {
		if (!user) {
			return res.redirect('/');
		}
		const reUser = user;
		reUser.verificationToken = undefined;
		reUser.isVerified = true;
		return reUser.save(errs => {
			if (errs) {
				res.send(errs);
			}
			res.redirect('/');
		});
	});
};

UserController.sendresetPassword = (req, res) => {
	const errors = validate(req.body.email, UserTypes.SignInForm.email);

	if (errors.error) {
		return res.status(403).json({ type: 'server', message: errors.error });
	}
	return User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			return res.status(403).json({
				type: 'form',
				message: 'Email not found.',
				formData: {
					fieldName: 'email',
					fieldValue: req.body.email,
				},
			});
		}
		const reUser = user;
		reUser.resetPasswordToken = genToken(50);
		reUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		return reUser.save(errs => {
			if (errs) {
				res.status(403).json({
					type: 'server',
					message: errs,
				});
			}
			sendEmail({
				to: user.email,
				from: '<codenamevero@gmail.com>',
				subject: `[CodeNameVero] Password Restore!`,
				template: 'reset-password',
				templateVars: {
					title: `Password Restore!`,
					name: user.name,
					emailAddress: user.email,
					resetUrl: `${req.protocol }://${req.host}/resetpassword?token=${
						user.resetPasswordToken
					}`,
				},
			});
			res.status(200).json({
				requestSuccess: {
					message:
						'Email with restore link was sent. Please check you email',
					operation: 'password_reset',
					redirectURL: '/',
				},
			});
		});
	});
};

UserController.resetPassword = (req, res) => {
	const errors = validate(req.body.password, UserTypes.SignInForm.password);

	if (errors.error) {
		// TODO: 'form'
		return res.status(403).json({ type: 'server', message: errors.error });
	}
	return User.findOne(
		{
			resetPasswordToken: req.query.token,
			resetPasswordExpires: { $gt: Date.now() },
		},
		(err, user) => {
			if (!user) {
				return res.status(403).json({
					type: 'server',
					message: 'Token already expired.',
				});
			}
			const reUser = user;
			reUser.password = req.body.password;
			reUser.resetPasswordToken = undefined;
			reUser.resetPasswordExpires = undefined;
			return reUser.save(errs => {
				if (errs) {
					res.send(errs);
				}
				res.status(200).json({
					requestSuccess: {
						message: 'Password Was Changed',
						operation: 'password_change',
						redirectURL: '/login',
					},
				});
			});
		}
	);
};

UserController.uploadAvatar = (req, res) => {
	cloudinary.v2.uploader.upload(req.file.path, (error, result) => {
		const image = new Image({
			name: result.public_id,
			size: result.bytes,
			publicURL: result.url,
			parentCollection: 'users',
			parentId: req.user._id,
		});
		image.save((err, img) => {
			res.json({
				user: {
					...req.user.toObject(),
					imageURL: img.publicURL,
				},
			});
		});
	});
};

UserController.deleteAvatar = (req, res) => {
	Image.findOneAndRemove({ parentId: req.user._id }, (err, deletedImg) => {
		if (err) {
			return res.json({ success: false, msg: 'Cannot remove item' });
		}
		if (!deletedImg) {
			return res.status(404).json({
				type: 'server',
				message: 'Image not Found',
				status: 404,
			});
		}
		return cloudinary.v2.uploader.destroy(deletedImg.name, error => {
			if (!error) {
				res.json({
					user: req.user,
					requestSuccess: {
						message: 'Avatar Was Deleted',
						operation: 'image_delete',
					},
				});
			}
		});
	});
};


UserController.getUsers = (req, res) => {
	let count = 10;
	let page = 1;
	if (parseFloat(req.query.q)) {
		count = req.query.q;
	}
	if (parseFloat(req.query.p)) {
		page = req.query.p;
	}
	const offset = (page - 1) * count;
	User.find()
		.sort({ date: -1 })
		.skip(parseFloat(offset))
		.limit(parseFloat(count))
		.exec((err, users) => {
			const mappedUsers = users.map(user => ({
				key: user._id,
				..._.pick(user, ['name', 'age', 'role', 'email']),
			}))
			User.count().exec((errs, counts) => {
				res.json({
					users: mappedUsers,
					counts,
					page
				})
			})
		})
};

UserController.editUsers = (req, res) => {
	const key = req.query.key;
	const page = req.query.p
	const restrictedFields = _.omit(req.body, ['name', 'age', 'role']);
	if (!_.isEmpty(restrictedFields)) {
		return res
			.status(403)
			.json({ type: 'server', message: 'Restricted field' });
	}
	const errors = validate(req.body, UserTypes.EditForm);
	if (errors.error) {
		return res.status(404).json({ type: 'server', message: errors.error });
	}
	return User.findOneAndUpdate(
		{ _id: key },
		_.pick(req.body, ['name', 'age', 'role']),
		{ new: true },
		async (err, user) => {
			if (err)
				return res.status(500).json({
					type: 'server',
					message: err,
				});

			const userObject = user.toObject()
			const updateUser = _.omit(userObject, [
				'password',
				'verificationToken',
				'resetPasswordToken',
				'resetPasswordExpires',
			])

			if (key == req.user._id) {
				const image = await Image.findOne(
					{ parentCollection: 'users', parentId: user._id },
					'publicURL',)
				updateUser.imageURL = _.get(image, 'publicURL', undefined);
			}
			return res.json({
				user: {
					key: updateUser._id,
					..._.pick(user, ['name', 'age', 'role', 'email']),
				},
				page,
				currentUser: key == req.user._id ? updateUser : null,
				requestSuccess: {
					message: 'User updated',
					operation: 'user_edit',
				},
			});
		}
	);
};


UserController.handleSearch = (req, res) => {
	if (req.query.q) {
		const query = User.find({
			$or: [
				{
					name: {
						$regex: new RegExp(req.query.q),
						$options: '-i',
					},
				},
				{
					email: {
						$regex: new RegExp(req.query.q),
						$options: '-i',
					},
				},
			],
		}).sort({ date: -1 });
		query.exec((err, foundUsers) => {
			const mappedUsers = foundUsers.map(user => ({
				key: user._id,
				..._.pick(user, ['name', 'age', 'role', 'email']),
			}))
			res.json({
				users: mappedUsers,
			});
		});
	}
};


UserController.handleRemove = async (req, res) => {
	let count = 10;
	let page = 1;
	const key = req.query.key;
	if (parseFloat(req.query.q)) {
		count = req.query.q;
	}
	if (parseFloat(req.query.p)) {
		page = req.query.p;
	}
	const offset = page * count;
	return User.find()
		.sort({ date: -1 })
		.skip(parseFloat(offset))
		.limit(1)
		.exec((errs, users) => {
			User.remove({ _id: key }).exec((err) => {
				if (err) return req.status(500).json({err})
				if(!users[0]) {
					return res.status(200).json({userObject: null, page, key});
				} 
				const userObject = {
					key: users[0]._id,
					..._.pick(users[0], ['name', 'age', 'role', 'email']),
				}
				return res.status(200).json({userObject, page, key});
			})	
		})
}


module.exports = UserController;
