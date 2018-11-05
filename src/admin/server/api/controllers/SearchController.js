const User = require('mongoose').model('User');
const Image = require('mongoose').model('Image');
const _ = require('lodash');

const SearchController = {};

SearchController.handleSearch = (req, res) => {
	if (req.query.q) {
		const query = User.find({
			name: {
				$regex: new RegExp(req.query.q),
				$options: '-i',
			},
			isVerified: true,
		}).limit(10);
		query.exec((err, users) => {
			if (users.length) {
				const userIds = users.map(user => user._id);
				Image.find(
					{
						parentCollection: 'users',
						parentId: { $in: userIds },
					},
					(errs, images) => {
						const usersWithImages = _.map(users, user => {
							const foundImage = _.filter(
								images,
								image => image.parentId == user._id
							);

							return _.assign(user.toObject(), {
								imageURL: _.get(
									foundImage,
									'[0].publicURL',
									undefined
								),
							});
						});
						res.json({
							users: usersWithImages,
						});
					}
				);
			}
		});
	}
};

module.exports = SearchController;
