var path = require("path");

var myConfig = require("./webpack.config.js");

myConfig.output.filename = "[name].js";

myConfig.module.loaders = myConfig.module.loaders.concat([
		{ test: /\.jpg$/, loader: "file-loader" },
		{ test: /\.png$/, loader: "url-loader?mimetype=image/png" },
		{ test: /\.md/, loaders: ["html", "remarkable"] }
	]);

myConfig.entry = {
	"react-stockcharts-home": "./docs/index.js",
	"react-stockcharts-documentation": "./docs/documentation.js"
};

/*myConfig.externals = {
	"d3": "d3"
} // removing React external since 0.14 is not published yet, still in alpha 2
*/

myConfig.remarkable = {
	preset: "full",
	html: true,
	linkify: true,
	typographer: true
};

var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

myConfig.plugins.push(new CommonsChunkPlugin({
	name: "react-stockcharts-docs-core",
	minChunks: Infinity
}));

myConfig.resolve.root = [__dirname, path.join(__dirname, "docs")];
myConfig.devtool = "sourcemap";// "sourcemap", "sourcemap-inline", "eval";
myConfig.debug = true;

module.exports = myConfig;
