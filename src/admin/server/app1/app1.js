const express = require('express');

const app1 = express.Router();
const api = require('./api');

/* ...settings */

/* GET use app1 api. */
app1.use('/api', api);

module.exports = app1;