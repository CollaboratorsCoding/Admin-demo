const Message = require('mongoose').model('Message');
const _ = require('lodash');

const MessageController = {};

MessageController.getMessages = (req, res) => {
	let count = 20;
	let offset = 0;
	if (parseFloat(req.query.q)) {
		count = req.query.q;
	}
	if (parseFloat(req.query.o)) {
		offset = req.query.o;
	}
	const query = Message.find({
		parentId: 'admin',
	})
		.sort({ date: -1 })
		.skip(parseFloat(offset))
		.limit(parseFloat(count));

	query.exec((err, messages) => {
		Message.aggregate(
			[
				{
					$group: {
						_id: null,
						readMessages: {
							$sum: {
								$cond: [{ $eq: ['$isRead', true] }, 1, 0],
							},
						},
						unreadMessages: {
							$sum: {
								$cond: [{ $eq: ['$isRead', false] }, 1, 0],
							},
						},
					},
				},
			],
			(errs, result) =>
				res.json({
					messages: messages || [],
					unreadCount: _.get(result[0], 'unreadMessages', ''),
					readCount: _.get(result[0], 'readMessages', ''),
				})
		);
	});
};

MessageController.makeRead = (req, res) => {
	if (!req.body.messagesId) return res.status(404).json({ success: false });
	const messagesId = req.body.messagesId;
	if (messagesId === 'all') {
		return Message.update(
			{ isRead: false },
			{ $set: { isRead: true } },
			{ multi: true },
			() => {
				res.json({
					success: true,
				});
			}
		);
	}
	return Message.findByIdAndUpdate(
		messagesId,
		{ $set: { isRead: true } },
		{ new: true },
		(err, newMessage) => {
			res.json({
				message: newMessage,
				success: true,
			});
		}
	);
};

MessageController.handleSearch = (req, res) => {
	if (req.query.q) {
		const query = Message.find({
			$or: [
				{
					text: {
						$regex: new RegExp(req.query.q),
						$options: '-i',
					},
				},
				{
					tags: {
						$regex: new RegExp(req.query.q),
						$options: '-i',
					},
				},
			],
		}).sort({ date: -1 });
		query.exec((err, foundMessages) => {
			res.json({
				messages: foundMessages,
			});
		});
	}
};

module.exports = MessageController;
