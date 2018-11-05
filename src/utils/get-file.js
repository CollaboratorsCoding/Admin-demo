const fs = require('fs');
const path = require('path');

module.exports = p => fs.readFileSync(path.join(__dirname, p), 'utf8');
