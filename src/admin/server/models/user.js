const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
	},
	name: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: 'user',
		required: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
		required: true,
	},
	verificationToken: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

UserSchema.pre('save', function(next) {
	const user = this;
	if (!user.isModified('password')) return next();
	const hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(5), null);
	user.password = hash;
	next();
});

UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// Function create list error messages for joi
// const createErrors = (form,obj) => {
// 	const result = form.validate(obj, options);
// 	const errors = [];
// 	if (result.error) {
// 		result.error.details.forEach((detail) => {
// 			errors.push({
// 				key: detail.path[0],
// 				message: detail.message
// 			});
// 		})
// 	}
// 	return errors
// }
UserSchema.index({ name: 1 });
module.exports = mongoose.model('User', UserSchema);
