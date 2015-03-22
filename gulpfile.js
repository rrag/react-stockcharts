console.time('Loading plugins');

var gulp = require('gulp')
	, del = require('del')
	, gutil = require('gulp-util')
	, webpack = require('webpack')
	, browserSync = require('browser-sync')
	, merge = require('merge-stream');

console.timeEnd('Loading plugins');

gulp.task('default', function() {
	//var webpackConfig = require('./webpack.config.js');

	gutil.log('Usage gulp [', gutil.colors.magenta('task'), ']');
	gutil.log('List of available ', gutil.colors.magenta('tasks'));
	gutil.log(gutil.colors.magenta('clean'), '   clean the ./build directory');
	gutil.log(gutil.colors.magenta('build'), '   create a production build with minified assets');
	gutil.log(gutil.colors.magenta('dev'), '     create a dev build with assets and sourcemap');
	gutil.log(gutil.colors.magenta('watch'), '   build and watch the changes. Hot reload styles and javascript');
	gutil.log('          Launches a browser at localhost:3500 and does a hot reload');
	gutil.log('          on change of *.scss under src/styles/');
	gutil.log('          on change of *.js[x]? under src/scripts/subfolder');
	gutil.log(gutil.colors.magenta('serve'), '   serve a webserver on localhost:3500');
	gutil.log(gutil.colors.magenta('release'), ' create files under build/cjs that can be published to npm');

});

gulp.task('clean', function(cb) {
	del(['build', '.sass-cache'], cb);
});

function build(myConfig, cb) {
	/**/myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			'process.env': {
				// This has effect on the react lib size
				NODE_ENV: JSON.stringify('production')
			}
		})
		, new webpack.optimize.DedupePlugin()
		, new webpack.optimize.UglifyJsPlugin()
	);

	var compiler = webpack(myConfig);

	compiler.run(function(err, stats) {
		if (err) throw new gutil.PluginError('webpack:build', err);
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		cb();
	});
}

gulp.task('styles', ['clean'], function() {
	var compass = require('gulp-compass'),
		autoprefixer = require('gulp-autoprefixer'),
		concatCss = require('gulp-concat-css');

	return gulp.src('src/styles/*.scss')
		.pipe(compass({
			project: __dirname, //path.join(__dirname, '.'),
			css: 'build/styles/unmodified',
			sass: 'src/styles',
			image: 'images'
		}))
		.pipe(autoprefixer({
			browsers: ['last 6 versions'],
			cascade: false
		}))
		.pipe(concatCss("react-stockcharts.css"))
		.pipe(gulp.dest('build/styles'));
});

gulp.task('build', ['styles', 'dev'], function(cb) {
	// run webpack
	var webpackConfig = require('./webpack.config.js'),
		myConfig = Object.create(webpackConfig);
	myConfig.output.filename = myConfig.output.filename.replace('.js', '.min.js');
	build(myConfig, cb);
});

gulp.task('docs', ['html'], function(cb) {
	// run webpack
	var webpackConfig = require('./webpack.config.docs.js'),
		myConfig = Object.create(webpackConfig);

	gulp.src(['./docs/images/*'])
		.pipe(gulp.dest('build/images'));

	gulp.src(['./docs/data/*'])
		.pipe(gulp.dest('build/data'));

	build(myConfig, cb);
});

gulp.task('html', ['clean'], function () {
	var replace = require('gulp-replace');

	gulp.src('./docs/**/*.html')
		.pipe(replace(/<!-- *custom:jsinclude *([^ ]*) *-->/g,
			'<script type="text/javascript" src="$1"></script>'))
		.pipe(replace(/<!-- *custom:cssinclude *([^ ]*) *-->/g,
			'<link href="$1" rel="stylesheet">'))
		.pipe(replace(/<!-- *custom:remove(.|\n)*?endcustom -->/g,
			''))
		.pipe(gulp.dest('./build'));
});

gulp.task('dev', ['clean'], function(callback) {
	var webpackConfig = require('./webpack.config.dev.js'),
		myDevConfig = Object.create(webpackConfig);

	// create a single instance of the compiler to allow caching
	var devCompiler = webpack(myDevConfig);

	// run webpack
	devCompiler.run(function(err, stats) {
		if (err) throw new gutil.PluginError('webpack:build-dev', err);
		gutil.log('[webpack:build-dev]', stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task('watch', ['clean', 'serve'], function(callback) {
	var WebpackDevServer = require('webpack-dev-server');
	var webpackConfig = require('./webpack.config.watch.js'),
		watchConfig = Object.create(webpackConfig);

	var watchCompiler = webpack(watchConfig);
	// Start a webpack-dev-server
	var server = new WebpackDevServer(watchCompiler, {
		publicPath: watchConfig.output.publicPath,
		// hot: true,
		quiet: false,
		noInfo: false,
		stats: {
			colors: true
		}
	});

	server.listen(8090, 'localhost', function(err) {
		if (err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'http://localhost:8090/webpack-dev-server/index.html');
	});
	gulp.watch(["./docs/images/**/*", "./docs/md/**/*", "./docs/*.html", "./docs/data/*.tsv"], browserSync.reload);
	callback();
});

gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: ['build/', 'node_modules/', 'docs/']
		},
		browser: "google chrome",
		ui: {
			port: 9080
		},
		port: 3500
	});
});

gulp.task('test', function(cb) {
	var karma = require('karma').server;

	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, cb);
});

gulp.task('style', function() {
	var jscs = require('gulp-jscs');

	return gulp.src(['src/scripts/**/*.js', 'src/scripts/**/*.jsx', '*.js'])
		.pipe(jscs());
});

gulp.task('lint', function() {
	var jshint = require('gulp-jshint');
	var react = require('gulp-react');
	var stylish = require('jshint-stylish');
	var notify = require('gulp-notify');

	return gulp.src(['src/**/*.js', 'src/**/*.jsx', '*.js'])
		.pipe(react({harmony: true}))
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('release', ['build'], function(cb) {

	// replacement for jsx --harmony -x jsx src build/cjs && jsx --harmony src build/cjs
	var react = require('gulp-react');
	gulp.src(['src/**/*.js', 'src/**/*.jsx'])
				.pipe(react({harmony: true}))
				.pipe(gulp.dest('build'));

	// replacement for cp *.md build/cjs && cp .npmignore build/cjs
	gulp.src(['*.md', '.npmignore'])
				.pipe(gulp.dest('build'));

	var fs  = require('fs');
	var path = require('path');

	var pkg = require(path.join(__dirname, 'package.json'));
	var mkdirp = require('mkdirp');

	var origPackage = fs.readFileSync(path.join(__dirname, 'package.json')).toString();

	try {
		var pkg = JSON.parse(origPackage);
		var jsonFormat = require('json-format');
		delete pkg.devDependencies;
		delete pkg.scripts;
		pkg.main = 'index.js';
		buildPackage = jsonFormat(pkg).replace(/\t/g, '  ');
	} catch (er) {
		console.error('package.json parse error: ', er);
		process.exit(1);
	}

	fs.writeFile(path.join(__dirname, 'build', 'package.json'), buildPackage, function() {
		console.log('CJS package.json file rendered');
		cb();
	});
});
