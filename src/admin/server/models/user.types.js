const Joi = require('joi-browser');

const UserTypes = {};

UserTypes.SignUpForm = {
	email: Joi.string()
		.email()
		.required()
		.options({
			language: {
				string: {
					base: 'No string',
					email: 'invalid email',
				},
			},
		}),
	password: Joi.string()
		.trim()
		.min(8)
		.max(30)
		.regex(/[a-zA-Z0-9]{3,30}/)
		.required(),
	age: Joi.number()
		.min(18)
		.required()
		.options({
			language: {
				number: {
					min: '{{limit}}+ only',
				},
			},
		}),
	name: Joi.string()
		.trim()
		.required(),
};

UserTypes.SignInForm = {
	email: Joi.string()
		.email()
		.required()
		.options({
			language: {
				string: {
					base: 'No string',
					email: 'invalid email',
				},
			},
		}),
	password: Joi.string()
		.min(8)
		.max(30)
		.regex(/[a-zA-Z0-9]{3,30}/)
		.required(),
};

module.exports = UserTypes;
