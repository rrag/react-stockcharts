const webpack = require("webpack");
const path = require("path");

const { getIfUtils, removeEmpty } = require("webpack-config-utils");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const rootPath = path.join(__dirname, "..");

function buildConfig(mode) {
	const { ifProd, ifWatch, ifDocs } = getIfUtils(mode, ["prod", "dev", "docs", "watch"]);

	const docsEntry = {
		"react-stockcharts-home": "./docs/index.js",
		"react-stockcharts-documentation": "./docs/documentation.js",
	};

	const docsOrWatch = mode === "docs" || mode === "watch";
	const docsOrProd = mode === "docs" || mode === "prod";

	const devServer = {
		contentBase: [
			path.join(rootPath, "docs"),
			path.join(rootPath, "build"),
			path.join(rootPath, "node_modules"),
		],
		host: process.env.IP, // "10.0.0.106", "localhost"
		port: process.env.PORT,
	};

	const context = rootPath;
	const loadersForDocs = [
		{ test: /\.jpg$/, loader: "file-loader" },
		{ test: /\.(png|svg)$/, loader: "url-loader?mimetype=image/png" },
		{ test: /\.md/, loaders: ["html", "remarkable"] },
		{ test: /\.scss$/, loaders: ["style", "css", "autoprefixer", "sass?outputStyle=expanded"] }
	];

	return {
		context,
		entry: Object.assign({
			"react-stockcharts": "./src/index.js"
		}, (docsOrWatch ? docsEntry : {})),
		output: {
			path: path.join(rootPath, "build/"),
			filename: `dist/[name]${ifProd(".min", "")}${ifDocs(".[chunkhash]", "")}.js`,
			publicPath: "",
			library: "ReStock",
			libraryTarget: "umd",
			pathinfo: ifWatch(true, false), // since we have eval as devtool for watch, pathinfo gives line numbers which are close enough
		},
		devtool: "sourcemap", // ifWatch("cheap-module-eval-source-map", "sourcemap"),
		module: {
			loaders: removeEmpty([
				// { test: /\.json$/, loader: "json" },
				{ test: /\.(js|jsx)$/, loaders: ["babel"], exclude: /node_modules/ },
				...(docsOrWatch ? loadersForDocs : []),
			])
		},
		plugins: removeEmpty([
			new ProgressBarPlugin(),
			new webpack.NoErrorsPlugin(),
			new webpack.optimize.OccurrenceOrderPlugin(),

			(docsOrProd ? new webpack.DefinePlugin({
				"process.env": {
					// This has effect on the react lib size
					NODE_ENV: JSON.stringify("production"),
				},
			}) : undefined),
			(docsOrWatch ? new webpack.optimize.CommonsChunkPlugin({
				names: ["react-stockcharts"],
				minChunks: Infinity
			}) : undefined),

			ifProd(new webpack.optimize.DedupePlugin()),
			ifProd(new webpack.optimize.UglifyJsPlugin({
				compress: {
					screw_ie8: true,
					warnings: false,
					drop_console: true,
				},
				sourceMap: true,
			})),

			...(docsOrWatch ? [new HtmlWebpackPlugin({
				template: "./docs/pageTemplate.js",
				inject: false,
				page: "index",
				mode,
				filename: "index.html"
			}), new HtmlWebpackPlugin({
				template: "./docs/pageTemplate.js",
				inject: false,
				page: "documentation",
				mode,
				filename: "documentation.html"
			}), new webpack.LoaderOptionsPlugin({
				options: { remarkable: getRemarkable(docsOrWatch), context }
			})] : []),
		]),
		devServer,
		externals: {
			"react": "React",
			"react-dom": "ReactDOM",
			// "d3": "d3",
		},
		resolve: Object.assign({
			extensions: [".js", ".jsx", ".scss", ".md"]
		}, (docsOrWatch ? {
			alias: { "react-stockcharts": path.join(rootPath, "src") },
			modules: ["docs", "node_modules"]
		} : {}))
	};
}

function getRemarkable(docsOrWatch) {
	if (docsOrWatch) {
		var Prism = require("prismjs");

		require("prismjs/components/prism-jsx");
		require("prismjs/plugins/line-numbers/prism-line-numbers");

		return {
			preset: "full",
			html: true,
			linkify: true,
			typographer: true,
			highlight: function(str, lang) {
				var grammer = lang === undefined || Prism.languages[lang] === undefined ? Prism.languages.markup : Prism.languages[lang];
				return Prism.highlight(str, grammer, lang);
			}
		};
	}
}

module.exports = buildConfig;
