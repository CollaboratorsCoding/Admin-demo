const nanoid = require('nanoid')


exports.genToken = (count) => nanoid(count);