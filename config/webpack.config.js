const webpack = require("webpack");
const path = require("path");

const { getIfUtils, removeEmpty } = require("webpack-config-utils");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const rootPath = path.join(__dirname, "..");

function buildConfig(mode) {
	const { ifWatch, ifDocs } = getIfUtils(mode, ["docs", "watch"]);

	const docsEntry = {
		"react-stockcharts-home": "./docs/index.js",
		"react-stockcharts-documentation": "./docs/documentation.js",
	};

	const devServer = {
		static: [
			{ directory: path.resolve(rootPath, "docs") },
			{ directory: path.resolve(rootPath, "build") },
			{ directory: path.resolve(rootPath, "node_modules") },
		],
		host: process.env.IP, // "10.0.0.106", "localhost"
		port: parseInt(process.env.PORT),
	};

	const context = rootPath;
	const loadersForDocs = [
        { test: /\.jpg$/, loader: "file-loader" },
        {
            test: /\.(png|svg)$/,
            loader: "url-loader",
            options: { mimetype: "image/png" },
        },
        { test: /\.md$/, loader: "html-loader" },
        { test: /\.md$/, loader: "remarkable-loader" },
        { test: /\.scss$/, loader: "style-loader" },
        { test: /\.scss$/, loader: "css-loader" },
        {
            test: /\.scss$/,
            loader: "sass-loader",
            options: { sassOptions: { outputStyle: "expanded" } },
        },
    ];

	console.log("MODE", mode);
	return {
		context,
		entry: docsEntry,
		output: {
			path: path.join(rootPath, "build/"),
			filename: `dist/[name]${ifDocs(".[chunkhash]", "")}.js`,
			publicPath: "",
			library: "ReStock",
			libraryTarget: "umd",
			pathinfo: ifWatch(true, false), // since we have eval as devtool for watch, pathinfo gives line numbers which are close enough
		},
        // devtool: ifWatch("^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$"),
        module: {
            rules: removeEmpty([
                // { test: /\.json$/, loader: "json" },
                {
                    test: /\.(js|jsx)$/,
                    loader: "babel-loader",
                    exclude: /node_modules/m,
                    options: { presets: ["@babel/env", "@babel/preset-react"] },
                },
                ...loadersForDocs,
            ]),
        },
		performance: {
			hints: false,
		},
		plugins: removeEmpty([
			new ProgressBarPlugin(),
			new webpack.NoEmitOnErrorsPlugin(),
			// new webpack.optimize.OccurrenceOrderPlugin(),

			ifDocs(new webpack.DefinePlugin({
				"process.env": {
					// This has effect on the react lib size
					NODE_ENV: JSON.stringify("production"),
				},
			})),
			// ifProd(new webpack.optimize.DedupePlugin()),
			// ifDocs(new webpack.optimize.UglifyJsPlugin({
			// 	compress: {
			// 		screw_ie8: true,
			// 		warnings: false,
			// 		drop_console: true,
			// 	},
			// 	sourceMap: true,
			// })),
			new HtmlWebpackPlugin({
				template: "./docs/pageTemplate.js",
				inject: false,
				page: "index",
				mode,
				filename: "index.html"
			}),
			new HtmlWebpackPlugin({
				template: "./docs/pageTemplate.js",
				inject: false,
				page: "documentation",
				mode,
				filename: "documentation.html"
			}),
			new webpack.LoaderOptionsPlugin({
				options: { remarkable: getRemarkable(), context }
			}),
		]),
		devServer,
		externals: {
			"react": "React",
			"react-dom": "ReactDOM",
			// "d3": "d3",
		},
		resolve: {
			extensions: [".js", ".scss", ".md"],
			alias: {
				"react-stockcharts": path.join(rootPath, "src"),
			},
			modules: ["docs", "node_modules"]
		},
        mode: "development",
	};
}

function getRemarkable() {

	const Prism = require("prismjs");

	require("prismjs/components/prism-jsx");
	require("prismjs/plugins/line-numbers/prism-line-numbers");

	return {
		preset: "full",
		html: true,
		linkify: true,
		typographer: true,
		highlight: function(str, lang) {
			const grammer = lang === undefined || Prism.languages[lang] === undefined ? Prism.languages.markup : Prism.languages[lang];
			return Prism.highlight(str, grammer, lang);
		}
	};
}

module.exports = buildConfig;
