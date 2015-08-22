var path = require("path");
var shell = require('shelljs');

var root = path.join(__dirname, "..");

var target = path.join(root, "build");

shell.mkdir('-p', target);
shell.cp(path.join(root, "docs", "*.html"), target);

shell.ls(path.join(target, "*.html")).forEach(function(file) {
	shell.sed("-i",
		/<!-- *custom:jsinclude *([^ ]*) *-->/g,
		"<script type=\"text/javascript\" src=\"$1\"></script>",
		file);
	shell.sed("-i",
		/<!-- *custom:cssinclude *([^ ]*) *-->/g,
		"<link rel=\"stylesheet\" href=\"$1\">",
		file);
	shell.sed("-i",
		/<!-- *custom:remove(.|\n)*?endcustom -->/g,
		"",
		file);
})

