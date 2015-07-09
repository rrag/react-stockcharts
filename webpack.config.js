var webpack = require("webpack");
var path = require("path");

module.exports = {
	context: __dirname,
	entry: {
		app: "./src/index.js",
		// vendor: ["react"],
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
		// new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
		/*,
		new webpack.ContextReplacementPlugin(/colors$/, /^$/),
		new webpack.IgnorePlugin(/(dtrace-provider)|(source-map-support)$/)*/
	],
	externals: {
		"react": "React",
		"d3": "d3",
	},
	resolve: {
		// ReStock: "src/",
		// root: [__dirname, path.join(__dirname, "src"), path.join(__dirname, "docs")],
		extensions: ["", ".js", ".jsx", ".scss", ".md"]
	}/*,
	node: {
		fs: "empty",
		"dtrace-provider": "empty",
		"source-map-support": "empty"
	}*/
};
