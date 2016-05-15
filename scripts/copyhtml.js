var mkdirp = require("mkdirp");
var path = require("path");
var fs = require("fs");
// var shell = require('shelljs');

var root = path.join(__dirname, "..");

var source = path.join(root, "docs")
var target = path.join(root, "build");

// shell.mkdir('-p', target);
// shell.cp(, target);

mkdirp(target, function() {
	fs.readdir(source, function (err, files) {
		files.filter(file => file.endsWith(".html"))
			.forEach(file => {
				fs.readFile(path.join(source, file), function (err2, htmlFile) {
					var content = htmlFile.toString();
					content = content.replace(/<!-- *custom:jsinclude *([^ ]*) *-->/g, `<script type="text/javascript" src="$1"></script>`);
					content = content.replace(/<!-- *custom:cssinclude *([^ ]*) *-->/g, `<link rel="stylesheet" href="$1">`);
					content = content.replace(/<!-- *custom:remove(.|\n)*?endcustom -->/g, "");

					fs.writeFileSync(path.join(target, file), content);
				})
			})
	})
})



/*shell.ls(path.join(target, "*.html")).forEach(function(file) {
	var content = fs.readFileSync(path.join(root, file)).toString();

	content = content.replace(/<!-- *custom:jsinclude *([^ ]*) *-->/g, "<script type=\"text/javascript\" src=\"$1\"></script>");
	console.log(content);
	shell.sed("-i",
		/<!-- *custom:jsinclude *([^ ]*) *-->/g,
		"<script type=\"text/javascript\" src=\"$1\"></script>",
		file);
	shell.sed("-i",
		,
		,
		file);
	shell.sed("-i",
		,
		"",
		file);
	shell.sed("-i",
		/:a;N;$!ba;s/\n/g,
		"",
		file);
})

*/