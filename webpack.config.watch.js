
var config = require('./webpack.config.js');
var webpack = require('webpack');
/*
config.module.loaders.forEach(function(each) {
	if ('filename.jsx'.match(each.test) !== null) {
		each.loaders.unshift('react-hot');
	}
});

*/config.entry = [];
config.entry.push('./docs/index.js');
config.entry.push('webpack-dev-server/client?http://localhost:8090');
// config.entry.push('webpack/hot/only-dev-server');

config.devtool = 'sourcemap';//'sourcemap', sourcemap-inline', eval';
config.debug = true;
config.externals = null; // if externals are present hot reload does not work.
config.output.publicPath = 'http://localhost:8090/' + config.output.publicPath;

config.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = config;
