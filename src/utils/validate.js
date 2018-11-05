const Joi = require('joi-browser');

const options = {
	abortEarly: false,
	language: { key: '' },
};

const validate = (obj, schema, opt) => {
	const option = opt || options;
	return Joi.validate(obj, schema, option);
};

const validateField = (validator, value, cb) => {
	// console.log(value, validate(value, SignInForm.email));
	const checkErr = validate(value, validator);

	return checkErr.error ? cb(checkErr.error.details[0].message) : cb();
};

exports.validate = validate;
exports.validateField = validateField;
