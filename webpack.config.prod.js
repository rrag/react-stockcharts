var config = require("./webpack.config.js");
var webpack = require("webpack");

config.output.filename = config.output.filename.replace(".js", ".min.js");

config.plugins = config.plugins.concat(
	new webpack.DefinePlugin({
		"process.env": {
			// This has effect on the react lib size
			NODE_ENV: JSON.stringify("production")
		}
	}),
	new webpack.optimize.DedupePlugin(),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			drop_console: true
		}
	})
);

module.exports = config;