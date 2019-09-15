"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.defaultOptionsForAppearance = exports.defaultOptionsForComputation = exports.compare = exports.elderImpulse = exports.change = exports.elderRay = exports.sar = exports.forceIndex = exports.stochasticOscillator = exports.atr = exports.rsi = exports.macd = exports.renko = exports.pointAndFigure = exports.kagi = exports.heikinAshi = exports.bollingerBand = exports.tma = exports.wma = exports.sma = exports.ema = undefined;

var _ema = require("./ema");

Object.defineProperty(exports, "ema", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_ema).default;
	}
});

var _sma = require("./sma");

Object.defineProperty(exports, "sma", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_sma).default;
	}
});

var _wma = require("./wma");

Object.defineProperty(exports, "wma", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_wma).default;
	}
});

var _tma = require("./tma");

Object.defineProperty(exports, "tma", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_tma).default;
	}
});

var _bollingerBand = require("./bollingerBand");

Object.defineProperty(exports, "bollingerBand", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_bollingerBand).default;
	}
});

var _heikinAshi = require("./heikinAshi");

Object.defineProperty(exports, "heikinAshi", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_heikinAshi).default;
	}
});

var _kagi = require("./kagi");

Object.defineProperty(exports, "kagi", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_kagi).default;
	}
});

var _pointAndFigure = require("./pointAndFigure");

Object.defineProperty(exports, "pointAndFigure", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_pointAndFigure).default;
	}
});

var _renko = require("./renko");

Object.defineProperty(exports, "renko", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_renko).default;
	}
});

var _macd = require("./macd");

Object.defineProperty(exports, "macd", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_macd).default;
	}
});

var _rsi = require("./rsi");

Object.defineProperty(exports, "rsi", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_rsi).default;
	}
});

var _atr = require("./atr");

Object.defineProperty(exports, "atr", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_atr).default;
	}
});

var _stochasticOscillator = require("./stochasticOscillator");

Object.defineProperty(exports, "stochasticOscillator", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_stochasticOscillator).default;
	}
});

var _forceIndex = require("./forceIndex");

Object.defineProperty(exports, "forceIndex", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_forceIndex).default;
	}
});

var _sar = require("./sar");

Object.defineProperty(exports, "sar", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_sar).default;
	}
});

var _elderRay = require("./elderRay");

Object.defineProperty(exports, "elderRay", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_elderRay).default;
	}
});

var _change = require("./change");

Object.defineProperty(exports, "change", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_change).default;
	}
});

var _elderImpulse = require("./elderImpulse");

Object.defineProperty(exports, "elderImpulse", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_elderImpulse).default;
	}
});

var _compare = require("./compare");

Object.defineProperty(exports, "compare", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_compare).default;
	}
});

var _defaultOptionsForComputation = require("../calculator/defaultOptionsForComputation");

var defaultOptionsForComputation = _interopRequireWildcard(_defaultOptionsForComputation);

var _defaultOptionsForAppearance = require("./defaultOptionsForAppearance");

var defaultOptionsForAppearance = _interopRequireWildcard(_defaultOptionsForAppearance);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.defaultOptionsForComputation = defaultOptionsForComputation;
exports.defaultOptionsForAppearance = defaultOptionsForAppearance;
//# sourceMappingURL=index.js.map