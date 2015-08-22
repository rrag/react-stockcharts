var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("../webpack.config.watch.js");
var watchConfig = Object.create(webpackConfig);

var watchCompiler = webpack(watchConfig);

var express = require("express");

// Start a webpack-dev-server
var server = new WebpackDevServer(watchCompiler, {
	publicPath: watchConfig.output.publicPath,
	// hot: true,
	quiet: false,
	noInfo: false,
	stats: {
		colors: true
	}
});

server.listen(8090, "localhost", function(err) {
	if (err) throw new Error("webpack-dev-server", err);
	console.log("[webpack-dev-server]", "http://localhost:8090/webpack-dev-server/index.html");
});


var app = express();

app.use(express.static("build"));
app.use(express.static("node_modules"));
app.use(express.static("docs"));
app.listen(4000);

console.log("open http://localhost:4000/");