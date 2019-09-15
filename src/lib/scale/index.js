"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _discontinuousTimeScaleProvider = require("./discontinuousTimeScaleProvider");

Object.defineProperty(exports, "discontinuousTimeScaleProvider", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_discontinuousTimeScaleProvider).default;
	}
});
Object.defineProperty(exports, "discontinuousTimeScaleProviderBuilder", {
	enumerable: true,
	get: function get() {
		return _discontinuousTimeScaleProvider.discontinuousTimeScaleProviderBuilder;
	}
});

var _financeDiscontinuousScale = require("./financeDiscontinuousScale");

Object.defineProperty(exports, "financeDiscontinuousScale", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_financeDiscontinuousScale).default;
	}
});
exports.defaultScaleProvider = defaultScaleProvider;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultScaleProvider(xScale) {
	return function (data, xAccessor) {
		return { data: data, xScale: xScale, xAccessor: xAccessor, displayXAccessor: xAccessor };
	};
}
//# sourceMappingURL=index.js.map