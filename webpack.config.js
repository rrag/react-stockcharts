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
		publicPath: "js/",
		library: "ReStock",
		libraryTarget: "umd",
	},
	module: {
		loaders: [
			{ test: /\.json$/, loader: "json" },
			{ test: /\.(js|jsx)$/, loaders: ["babel"], exclude: /node_modules/ },
			{ test: /\.scss$/, loaders: ["style", "css", "autoprefixer", "sass?outputStyle=expanded"] },
		]
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
	],
	externals: {
		"react": "React",
		"d3": "d3",
	},
	resolve: {
		// root: [__dirname, path.join(__dirname, "src"), path.join(__dirname, "docs")],
		extensions: ["", ".js", ".jsx", ".scss", ".md"]
	}
};
