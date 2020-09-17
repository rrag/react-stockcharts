"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Annotate = require("./Annotate");

Object.defineProperty(exports, "Annotate", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_Annotate).default;
	}
});

var _LabelAnnotation = require("./LabelAnnotation");

Object.defineProperty(exports, "LabelAnnotation", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_LabelAnnotation).default;
	}
});

var _SvgPathAnnotation = require("./SvgPathAnnotation");

Object.defineProperty(exports, "SvgPathAnnotation", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_SvgPathAnnotation).default;
	}
});

var _Label = require("./Label");

Object.defineProperty(exports, "Label", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_Label).default;
	}
});
exports.buyPath = buyPath;
exports.sellPath = sellPath;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var halfWidth = 10;
var bottomWidth = 3;
var height = 20;

function buyPath(_ref) {
	var x = _ref.x,
	    y = _ref.y;

	return "M" + x + " " + y + " " + ("L" + (x + halfWidth) + " " + (y + halfWidth) + " ") + ("L" + (x + bottomWidth) + " " + (y + halfWidth) + " ") + ("L" + (x + bottomWidth) + " " + (y + height) + " ") + ("L" + (x - bottomWidth) + " " + (y + height) + " ") + ("L" + (x - bottomWidth) + " " + (y + halfWidth) + " ") + ("L" + (x - halfWidth) + " " + (y + halfWidth) + " ") + "Z";
}

function sellPath(_ref2) {
	var x = _ref2.x,
	    y = _ref2.y;

	return "M" + x + " " + y + " " + ("L" + (x + halfWidth) + " " + (y - halfWidth) + " ") + ("L" + (x + bottomWidth) + " " + (y - halfWidth) + " ") + ("L" + (x + bottomWidth) + " " + (y - height) + " ") + ("L" + (x - bottomWidth) + " " + (y - height) + " ") + ("L" + (x - bottomWidth) + " " + (y - halfWidth) + " ") + ("L" + (x - halfWidth) + " " + (y - halfWidth) + " ") + "Z";
}
//# sourceMappingURL=index.js.map