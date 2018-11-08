const express = require('express');
const cloudinary = require('cloudinary');

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const api = express.Router();
const UserController = require('./controllers/UserController');
const SearchController = require('./controllers/SearchController');
const MessageController = require('./controllers/MessageController');

const checkJwt = require('../../../middlewares/checkJwt');

cloudinary.config({
	cloud_name: 'codenamevero',
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

/* rest api */

// USER API

api.get('/profile', checkJwt, UserController.getprofile);
api.get('/users', checkJwt, UserController.getUsers);
api.get('/users/search', UserController.handleSearch);
api.put('/users', checkJwt, UserController.editUsers);
api.put('/profile', checkJwt, UserController.editProfile);
api.get('/profile/:id', checkJwt, UserController.getuserprofile);
api.get('/verification', UserController.verification);
api.post(
	'/uploadAvatar',
	checkJwt,
	upload.single('avatar'),
	UserController.uploadAvatar
);
api.delete('/deleteAvatar', checkJwt, UserController.deleteAvatar);
api.post('/sendresetPassword', UserController.sendresetPassword);
api.post('/resetPassword', UserController.resetPassword);
api.post('/signin', UserController.signin);
api.post('/signup', UserController.signup);
api.get('/logout', UserController.logout);

// SEARCH API

api.get('/search', SearchController.handleSearch);

// IMAGES API

api.get('/messages', checkJwt, MessageController.getMessages);
api.put('/messages', checkJwt, MessageController.makeRead);
api.get('/messages/search', checkJwt, MessageController.handleSearch);

/* ... */

module.exports = api;
