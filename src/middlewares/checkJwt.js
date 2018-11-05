const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');

const checkJwt = (req, res, next) => {
	let token = req.session.token;
	if (!token && req.headers.authorization) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
			if (err) {
				res.status(403).json({
					error: {
						type: 'server',
						message: 'Invalid token',
					},
					isLoggedIn: false,
				});
			} else {
				const FindUser = await User.findOne({ _id: decode._id });
				if (FindUser) {
					req.user = FindUser;
					next();
				} else {
					req.logout();
					req.session.token = null;
					res.status(404).json({
						error: {
							type: 'server',
							message: 'User not exist anymore',
						},
						isLoggedIn: false,
					});
				}
			}
		});
	} else {
		res.json({ user: {}, isLoggedIn: false });
	}
};

module.exports = checkJwt;
