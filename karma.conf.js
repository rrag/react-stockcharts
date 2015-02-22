var webpack = require('webpack');
var configSettings = {
	normal: {},
	uglified: {
		plugins: [
			new webpack.optimize.UglifyJsPlugin()
		]
	}
};

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: __dirname,

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha'],

		// list of files / patterns to load in the browser
		// 'utils/phantomjs-shims.js',
		files: [
			// all files ending in '_test'
			'test/*_test.js',
			'test/**/*_test.js'
			// each file acts as entry point for the webpack configuration
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'tests/**/*.js': ['webpack', 'sourcemap']
		},

		webpack: Object.keys(configSettings).map(function(name) {
			var config = {
				name: name,
				devtool: 'inline-source-map',
				resolve: {
					extensions: ['', '.js', '.jsx']
				},
				module: {
					loaders: [
						{ test: /\.(js|jsx)$/, loaders: ['jsx?harmony'], exclude: /node_modules/ }
					]
				}
			};
			Object.keys(configSettings[name]).forEach(function(key) {
				config[key] = configSettings[name][key];
			});
			return config;
		}),
		webpackMiddleware: {
			stats: {
				colors: true
			}
		},
		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['spec'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		plugins: [
			require('karma-webpack')
			, require('karma-chrome-launcher')
			//, require('karma-phantomjs-launcher')
			, require('karma-mocha')
		],

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		//browsers: ['Chrome', 'Firefox', 'PhantomJS'],
		browsers: ['Chrome'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,
		browserNoActivityTimeout: 20000,

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true

	});
};
