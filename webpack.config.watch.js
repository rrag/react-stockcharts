
var config = require("./webpack.config.docs.js");

config.output.publicPath = "http://localhost:8090/" + config.output.publicPath;

module.exports = config;
