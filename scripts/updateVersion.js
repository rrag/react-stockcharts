var path = require("path");
var fs = require("fs");
var shell = require('shelljs');

var root = path.join(__dirname, "..");

var packageJson = fs.readFileSync(path.join(root, "package.json")).toString()
var version = JSON.parse(packageJson).version;

var indexjs = path.join(root, "src", "index.js");

shell.sed("-i", /(const version = ").*";/, "$1" + version + "\";", indexjs)

console.log("updated version to", version);
