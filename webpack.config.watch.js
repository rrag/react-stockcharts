
var config = require('./webpack.config.docs.js');

// config.externals = null; // if externals are present hot reload does not work.
config.output.publicPath = 'http://localhost:8090/' + config.output.publicPath;

module.exports = config;
