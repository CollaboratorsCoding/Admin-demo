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


UserTypes.EditForm = {
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
	role: Joi.string()
		.trim()
		.required(),
}

module.exports = UserTypes;
