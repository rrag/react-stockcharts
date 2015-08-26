
var config = require("./webpack.config.docs.js");
var path = require("path");


config.devServer = {
	contentBase: path.join(__dirname, "docs"),
	port: 8090,
};

config.output.publicPath = "http://localhost:" + config.devServer.port + "/" + config.output.publicPath;

module.exports = config;
