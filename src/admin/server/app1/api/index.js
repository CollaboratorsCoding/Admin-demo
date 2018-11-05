const express = require('express');

const api = express.Router();
const TestController = require('./controllers/testcontroller');

/* rest api */
api.get('/test-app1-api', TestController.get_test); // http://localhost:3000/admin/app1/api/test-app1-api

/* ... */

module.exports = api;