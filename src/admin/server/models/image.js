const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	size: {
		type: Number,
	},
	publicURL: {
		type: String,
		required: true,
	},
	parentCollection: {
		type: String,
		required: true,
	},
	parentId: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Image', ImageSchema);
