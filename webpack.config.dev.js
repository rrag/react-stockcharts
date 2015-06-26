
var config = require("./webpack.config.js");

config.devtool = "sourcemap";
config.debug = true;

module.exports = config;
