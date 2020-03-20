var strftime = require('../lib/strftime.js');

var val = process.argv[2] || new Date();
console.log(strftime(val, 'W'));
