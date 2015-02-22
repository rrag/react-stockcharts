var webpack = require('webpack');

module.exports = {
	entry: [
		'./src/scripts/index.js'
		, './docs/scripts/index.js'
	],
	output: {
		path: __dirname + '/build/scripts/',
		filename: 'react-stockcharts.js',
		publicPath: 'js/'
	},
	module: {
		loaders: [
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.(js|jsx)$/, loaders: ['jsx?harmony'], exclude: /node_modules/ },
			{ test: /\.scss$/, loaders: ['style', 'css', 'autoprefixer', 'sass?outputStyle=expanded'] }
		]
	},
	plugins: [
		new webpack.NoErrorsPlugin()
	],
	externals: {
		react: 'React'
		, d3: 'd3'
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.scss']
	}
};
