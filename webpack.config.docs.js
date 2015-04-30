
var myConfig = require('./webpack.config.js');
var webpack = require('webpack');

myConfig.output.filename = '[name].js'

myConfig.entry = {
	'react-stockcharts-home': './docs/index.js',
	'react-stockcharts-dashboard': './docs/dashboard.js'
};

var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

myConfig.plugins.push(new CommonsChunkPlugin({
    name: "react-stockcharts-docs-core",
    minChunks: Infinity
}));

//myConfig.plugins.push(new CommonsChunkPlugin("react-stockcharts-docs-core", "react-stockcharts-docs-core.js"));
//myConfig.plugins.push(new CommonsChunkPlugin("react-stockcharts-docs-core.js"));


myConfig.devtool = 'sourcemap';//'sourcemap', 'sourcemap-inline', 'eval';
myConfig.debug = true;

module.exports = myConfig;
