var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");

var origPackage = fs.readFileSync(path.join(root, "package.json")).toString();
var buildPackage

try {
	var pkg = JSON.parse(origPackage);
	delete pkg.devDependencies;
	delete pkg.scripts;
	delete pkg.browserify;
	pkg.main = "index.js";
	pkg["jsnext:main"] = "index.js";

	buildPackage = JSON.stringify(pkg, null, 2);

} catch (er) {
	console.error("package.json parse error: ", er);
	// process.exit(1);
}

fs.writeFile(path.join(root, "build", "package.json"), buildPackage, function() {
	console.log("CJS package.json file rendered");
});