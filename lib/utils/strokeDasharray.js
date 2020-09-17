"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getStrokeDasharrayCanvas = getStrokeDasharrayCanvas;
var strokeDashTypes = exports.strokeDashTypes = ["Solid", "ShortDash", "ShortDash2", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash", "LongDash", "DashDot", "LongDashDot", "LongDashDotDot"];

function getStrokeDasharrayCanvas(type) {
	var a = getStrokeDasharray(type).split(",");

	if (a.length === 1) return [];

	return a.map(function (d) {
		return Number(d);
	});
}
var getStrokeDasharray = exports.getStrokeDasharray = function getStrokeDasharray(type) {
	switch (type) {
		default:
		case "Solid":
			return "none";
		case "ShortDash":
			return "6, 2";
		case "ShortDash2":
			return "6, 3";
		case "ShortDot":
			return "2, 2";
		case "ShortDashDot":
			return "6, 2, 2, 2";
		case "ShortDashDotDot":
			return "6, 2, 2, 2, 2, 2";
		case "Dot":
			return "2, 6";
		case "Dash":
			return "8, 6";
		case "LongDash":
			return "16, 6";
		case "DashDot":
			return "8, 6, 2, 6";
		case "LongDashDot":
			return "16, 6, 2, 6";
		case "LongDashDotDot":
			return "16, 6, 2, 6, 2, 6";
	}
};
//# sourceMappingURL=strokeDasharray.js.map