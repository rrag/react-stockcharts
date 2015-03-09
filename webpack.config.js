var webpack = require('webpack');

module.exports = {
	entry: [
		'./src/index.js'
	],
	output: {
		path: __dirname + '/build/dist/',
		filename: 'react-stockcharts.js',
		publicPath: 'js/'
	},
	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.(js|jsx)$/, loaders: ['jsx?harmony'], exclude: /node_modules/ },
			{ test: /\.scss$/, loaders: ['style', 'css', 'autoprefixer', 'sass?outputStyle=expanded'] },
			{ test: /\.jpg$/, loader: "file-loader" },
			{ test: /\.png$/, loader: "url-loader?mimetype=image/png" },
			{ test: /\.md/, loaders: ['html', 'remarkable'] }
		]
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.ContextReplacementPlugin(/colors$/, /^$/),
		new webpack.IgnorePlugin(/(dtrace-provider)|(source-map-support)$/)
	],
	externals: {
		react: 'React'
		, "react/addons": 'React'
		, d3: 'd3'
	},
	remarkable: {
		preset: 'full',
		html: true,
		linkify: true,
		typographer: true
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss', '.md']
	},
	node: {
		fs: "empty",
		"dtrace-provider": "empty",
		"source-map-support": "empty"
	}
};
