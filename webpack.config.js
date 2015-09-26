var webpack = require("webpack");
var path = require("path");

module.exports = {
	context: __dirname,
	entry: {
		app: "./src/index.js",
	},
	output: {
		path: path.join(__dirname, "build/dist/"),
		filename: "react-stockcharts.js",
		publicPath: "dist/",
		library: "ReStock",
		libraryTarget: "umd",
	},
	debug: true,
	devtool: "sourcemap",
	module: {
		loaders: [
			{ test: /\.json$/, loader: "json" },
			{ test: /\.(js|jsx)$/, loaders: ["babel"], exclude: /node_modules/ },
		]
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
	],
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
		"d3": "d3",
	},
	resolve: {
		// root: [__dirname, path.join(__dirname, "src"), path.join(__dirname, "docs")],
		/* alias: {
			"react-dom": "react/lib/ReactDOM"
		}, */
		extensions: ["", ".js", ".jsx", ".scss", ".md"]
	}
};
