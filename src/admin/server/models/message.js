const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	text: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		default: 'Test title message',
	},
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	parentCollection: {
		type: String,
		required: true,
	},
	parentId: {
		type: String,
		required: true,
	},
	tags: {
		type: [String],
		default: ['not_tagged',],
	},
});

module.exports = mongoose.model('Message', MessageSchema);
