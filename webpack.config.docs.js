var path = require("path");

var myConfig = require("./webpack.config.js");

myConfig.output.filename = "[name].js";

myConfig.module.loaders = myConfig.module.loaders.concat([
	{ test: /\.jpg$/, loader: "file-loader" },
	{ test: /\.(png|svg)$/, loader: "url-loader?mimetype=image/png" },
	{ test: /\.md/, loaders: ["html", "remarkable"] },
	{ test: /\.scss$/, loaders: ["style", "css", "autoprefixer", "sass?outputStyle=expanded"] },
]);

myConfig.entry = {
	"react-stockcharts-home": "./docs/index.js",
	"react-stockcharts-documentation": "./docs/documentation.js"
};

var Prism = require('prismjs'); ///components/prism-core

// console.log(Prism.languages);
require('prismjs/components/prism-jsx');
require('prismjs/plugins/line-numbers/prism-line-numbers');

myConfig.remarkable = {
	preset: "full",
	html: true,
	linkify: true,
	typographer: true,
	highlight: function (str, lang) {
		var grammer = lang === undefined || Prism.languages[lang] === undefined ? Prism.languages.markup : Prism.languages[lang];
		return Prism.highlight(str, grammer, lang);
	}
};

var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

myConfig.plugins = myConfig.plugins.concat(new CommonsChunkPlugin({
		name: "react-stockcharts-docs-core",
		minChunks: Infinity
	})
);

myConfig.resolve.alias = { "react-stockcharts": path.join(__dirname, "src") }
myConfig.resolve.root = [__dirname, path.join(__dirname, "docs")];
// myConfig.devtool = "sourcemap";// http://webpack.github.io/docs/configuration.html#devtool
// myConfig.debug = true;

module.exports = myConfig;
