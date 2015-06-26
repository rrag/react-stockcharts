console.time("Loading plugins");

var gulp = require("gulp")
	, del = require("del")
	, gutil = require("gulp-util")
	, webpack = require("webpack")
	, browserSync = require("browser-sync");
	// , merge = require("merge-stream");

console.timeEnd("Loading plugins");

gulp.task("default", function() {
	gutil.log("Usage gulp [", gutil.colors.magenta("task"), "]");
	gutil.log("List of available ", gutil.colors.magenta("tasks"));
	gutil.log(gutil.colors.magenta("clean"), "   clean the ./build directory");
	gutil.log(gutil.colors.magenta("build"), "   create a production build with minified assets");
	gutil.log(gutil.colors.magenta("dev"), "     create a dev build with assets and sourcemap");
	gutil.log(gutil.colors.magenta("watch"), "   build and watch the changes. Hot reload styles and javascript");
	gutil.log("          Launches a browser at localhost:3500 and does a hot reload");
	gutil.log("          on change of *.scss under src/styles/");
	gutil.log("          on change of *.js[x]? under src/scripts/subfolder");
	gutil.log(gutil.colors.magenta("serve"), "   serve a webserver on localhost:3500");
	gutil.log(gutil.colors.magenta("release"), " create files under build/cjs that can be published to npm");

});

gulp.task("clean", function(cb) {
	del(["build", ".sass-cache"], cb);
});

function build(myConfig, cb) {
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				NODE_ENV: JSON.stringify("production")
			}
		})
		// , new webpack.optimize.DedupePlugin()
		// , new webpack.optimize.UglifyJsPlugin()
	);

	var compiler = webpack(myConfig);

	compiler.run(function(err, stats) {
		if (err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		cb();
	});
}

gulp.task("styles", ["clean"], function() {
	var compass = require("gulp-compass"),
		autoprefixer = require("gulp-autoprefixer"),
		concatCss = require("gulp-concat-css");

	return gulp.src("src/styles/*.scss")
		.pipe(compass({
			project: __dirname,
			css: "build/styles/unmodified",
			sass: "src/styles",
			image: "images"
		}))
		.pipe(autoprefixer({
			browsers: ["last 6 versions"],
			cascade: false
		}))
		.pipe(concatCss("react-stockcharts.css"))
		.pipe(gulp.dest("build/styles"));
});

gulp.task("build", ["styles", "dev"], function(cb) {
	// run webpack
	var webpackConfig = require("./webpack.config.js");
	var myConfig = Object.create(webpackConfig);

	myConfig.output.filename = myConfig.output.filename.replace(".js", ".min.js");
	build(myConfig, cb);
});

gulp.task("docs", ["build"], function(cb) {

	var replace = require("gulp-replace");
	/*eslint-disable */

	gulp.src("./docs/*.html")
		.pipe(replace(/<!-- *custom:jsinclude *([^ ]*) *-->/g,
			'<script type="text/javascript" src="$1"></script>'))
		.pipe(replace(/<!-- *custom:cssinclude *([^ ]*) *-->/g,
			'<link href="$1" rel="stylesheet">'))
		.pipe(replace(/<!-- *custom:remove(.|\n)*?endcustom -->/g,
			""))
		.pipe(gulp.dest("./build"));
	/*eslint-enable */

	// run webpack
	var webpackConfig = require("./webpack.config.docs.js");
	var myConfig = Object.create(webpackConfig);

	gulp.src(["./docs/images/*"])
		.pipe(gulp.dest("build/images"));

	gulp.src(["./docs/data/*"])
		.pipe(gulp.dest("build/data"));

	build(myConfig, cb);
});

gulp.task("dev", ["clean"], function(callback) {
	var webpackConfig = require("./webpack.config.dev.js");
	var myDevConfig = Object.create(webpackConfig);

	// create a single instance of the compiler to allow caching
	var devCompiler = webpack(myDevConfig);

	// run webpack
	devCompiler.run(function(err, stats) {
		if (err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("watch", ["clean", "serve"], function(callback) {
	var WebpackDevServer = require("webpack-dev-server");
	var webpackConfig = require("./webpack.config.watch.js");
	var watchConfig = Object.create(webpackConfig);

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

	server.listen(8090, "localhost", function(err) {
		if (err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8090/webpack-dev-server/index.html");
	});
	gulp.watch(["./docs/images/**/*", "./docs/md/**/*", "./docs/*.html", "./docs/data/*.tsv"], browserSync.reload);
	callback();
});

gulp.task("serve", function() {
	browserSync({
		server: {
			baseDir: ["build/", "node_modules/", "docs/"]
		},
		browser: "google-chrome-stable",
		ui: {
			port: 9080
		},
		port: 3500
	});
});

gulp.task("serve2", function(cb) {
	var express = require("express");
	var app = express();
	app.use(express.static("build")); // path.join(__dirname, "build")
	app.use(express.static("node_modules"));
	app.use(express.static("docs"));
	app.listen(4000);
	cb();
});

var getFunctionFor = function(chartName) {
	/*eslint-disable */
	var r = 'var parseDate = d3.time.format("%Y-%m-%d").parse;' + "\n" +
	"d3.tsv("//rrag.github.io/react-stockcharts/data/MSFT.tsv", (err, data) => {" + "\n" +
	"	/* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */" + "\n" +
	"	data.forEach((d, i) => {" + "\n" +
	"		d.date = new Date(parseDate(d.date).getTime());"+ "\n" +
	"		d.open = +d.open;"+ "\n" +
	"		d.high = +d.high;"+ "\n" +
	"		d.low = +d.low;"+ "\n" +
	"		d.close = +d.close;"+ "\n" +
	"		d.volume = +d.volume;"+ "\n" +
	"		// console.log(d);"+ "\n" +
	"	});"+ "\n" +
	'	React.render(<' + chartName + ' data={data} />, document.getElementById("chart"));'+ "\n" +
	"});"
	/*eslint-enable */
	return r;
};

gulp.task("publishexamples", function(cb) {
	var examplesToPublish = ["AreaChart",
		"CandleStickChart",
		"CandleStickStockScaleChart",
		"CandleStickStockScaleChartWithVolumeHistogramV1",
		"CandleStickStockScaleChartWithVolumeHistogramV2",
		"CandleStickStockScaleChartWithVolumeHistogramV3",
		"CandleStickChartWithCHMousePointer",
		"CandleStickChartWithZoomPan",
		"CandleStickChartWithMA",
		"CandleStickChartWithEdge",
		"HaikinAshi",
		"Kagi",
		"PointAndFigure",
		"Renko"
	];

	var replace = require("gulp-replace");
	var path = require("path");

	examplesToPublish.forEach(function (eachEx) {
		gulp.src(path.join(__dirname, "docs/lib/charts", eachEx + ".jsx"))
			.pipe(replace(/var React = .*/, ""))
			.pipe(replace(/var d3 = .*/, ""))
			.pipe(replace(/var ReStock = .*/, ""))
			.pipe(replace(/module.exports = .*/, getFunctionFor(eachEx)))
			.pipe(gulp.dest(path.join(__dirname, "docs/examples", eachEx)));

		gulp.src(path.join(__dirname, "docs/examples/index.html"))
			.pipe(replace(/CHART_NAME_HERE/g, eachEx))
			.pipe(gulp.dest(path.join(__dirname, "docs/examples", eachEx)));
	});

	cb();
});

gulp.task("test", function(cb) {
	var karma = require("karma").server;
	var path = require("path");

	karma.start({
		configFile: path.join(__dirname, "karma.conf.js"),
		singleRun: true
	}, cb);
});

gulp.task("style", function() {
	var jscs = require("gulp-jscs");

	return gulp.src(["src/scripts/**/*.js", "src/scripts/**/*.jsx", "*.js"])
		.pipe(jscs());
});

gulp.task("lint", function() {
	var eslint = require("gulp-eslint");
	// var babel = require("gulp-babel");

	return gulp.src(["src/**/*.js", "src/**/*.jsx", "*.js"])
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format());
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		// .pipe(eslint.failOnError());
});

gulp.task("lint-watch", function() {
	gulp.watch(["src/**/*.js", "src/**/*.jsx", "*.js", ".eslintrc"], ["lint"]);
});

gulp.task("release", ["build"], function(cb) {

	// replacement for jsx --harmony -x jsx src build/cjs && jsx --harmony src build/cjs
	// var react = require("gulp-react");
	var babel = require("gulp-babel");
	gulp.src(["src/**/*.js", "src/**/*.jsx"])
				// .pipe(react({harmony: true}))
				.pipe(babel())
				.pipe(gulp.dest("build"));

	// replacement for cp *.md build/cjs && cp .npmignore build/cjs
	gulp.src(["*.md", ".npmignore"])
				.pipe(gulp.dest("build"));

	var fs = require("fs");
	var path = require("path");

	var origPackage = fs.readFileSync(path.join(__dirname, "package.json")).toString(), buildPackage;

	try {
		var pkg = JSON.parse(origPackage);
		var jsonFormat = require("json-format");
		delete pkg.devDependencies;
		delete pkg.scripts;
		pkg.main = "index.js";
		buildPackage = jsonFormat(pkg).replace(/\t/g, "  ");
	} catch (er) {
		console.error("package.json parse error: ", er);
		// process.exit(1);
	}

	fs.writeFile(path.join(__dirname, "build", "package.json"), buildPackage, function() {
		console.log("CJS package.json file rendered");
		cb();
	});
});
