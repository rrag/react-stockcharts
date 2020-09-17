"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isArray = exports.first = exports.overlayColors = exports.TOUCHEND = exports.TOUCHMOVE = exports.MOUSEUP = exports.MOUSEMOVE = exports.MOUSELEAVE = exports.MOUSEENTER = exports.yes = exports.PureComponent = exports.accumulatingWindow = exports.mappedSlidingWindow = exports.shallowEqual = exports.noop = exports.identity = exports.slidingWindow = exports.merge = exports.zipper = exports.rebind = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _rebind = require("./rebind");

Object.defineProperty(exports, "rebind", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_rebind).default;
	}
});

var _zipper = require("./zipper");

Object.defineProperty(exports, "zipper", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_zipper).default;
	}
});

var _merge = require("./merge");

Object.defineProperty(exports, "merge", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_merge).default;
	}
});

var _slidingWindow = require("./slidingWindow");

Object.defineProperty(exports, "slidingWindow", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_slidingWindow).default;
	}
});

var _identity = require("./identity");

Object.defineProperty(exports, "identity", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_identity).default;
	}
});

var _noop = require("./noop");

Object.defineProperty(exports, "noop", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_noop).default;
	}
});

var _shallowEqual = require("./shallowEqual");

Object.defineProperty(exports, "shallowEqual", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_shallowEqual).default;
	}
});

var _mappedSlidingWindow = require("./mappedSlidingWindow");

Object.defineProperty(exports, "mappedSlidingWindow", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_mappedSlidingWindow).default;
	}
});

var _accumulatingWindow = require("./accumulatingWindow");

Object.defineProperty(exports, "accumulatingWindow", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_accumulatingWindow).default;
	}
});

var _PureComponent = require("./PureComponent");

Object.defineProperty(exports, "PureComponent", {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_PureComponent).default;
	}
});

var _barWidth = require("./barWidth");

Object.keys(_barWidth).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _barWidth[key];
		}
	});
});

var _strokeDasharray = require("./strokeDasharray");

Object.keys(_strokeDasharray).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _strokeDasharray[key];
		}
	});
});
exports.getLogger = getLogger;
exports.sign = sign;
exports.path = path;
exports.functor = functor;
exports.createVerticalLinearGradient = createVerticalLinearGradient;
exports.getClosestItemIndexes2 = getClosestItemIndexes2;
exports.degrees = degrees;
exports.radians = radians;
exports.getClosestValue = getClosestValue;
exports.find = find;
exports.d3Window = d3Window;
exports.getTouchProps = getTouchProps;
exports.getClosestItemIndexes = getClosestItemIndexes;
exports.getClosestItem = getClosestItem;
exports.head = head;
exports.tail = tail;
exports.last = last;
exports.isDefined = isDefined;
exports.isNotDefined = isNotDefined;
exports.isObject = isObject;
exports.touchPosition = touchPosition;
exports.mousePosition = mousePosition;
exports.clearCanvas = clearCanvas;
exports.capitalizeFirst = capitalizeFirst;
exports.hexToRGBA = hexToRGBA;
exports.toObject = toObject;
exports.mapValue = mapValue;
exports.mapObject = mapObject;
exports.replaceAtIndex = replaceAtIndex;
exports.forOwn = forOwn;

var _d3Scale = require("d3-scale");

var _d3Array = require("d3-array");

var _noop2 = _interopRequireDefault(_noop);

var _identity2 = _interopRequireDefault(_identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getLogger(prefix) {
	var logger = _noop2.default;
	if (process.env.NODE_ENV !== "production") {
		logger = require("debug")("react-stockcharts:" + prefix);
	}
	return logger;
}

function sign(x) {
	return (x > 0) - (x < 0);
}

var yes = exports.yes = function yes() {
	return true;
};

function path() {
	var loc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	var key = Array.isArray(loc) ? loc : [loc];
	var length = key.length;

	return function (obj, defaultValue) {
		if (length === 0) return isDefined(obj) ? obj : defaultValue;

		var index = 0;
		while (obj != null && index < length) {
			obj = obj[key[index++]];
		}
		return index === length ? obj : defaultValue;
	};
}

function functor(v) {
	return typeof v === "function" ? v : function () {
		return v;
	};
}

function createVerticalLinearGradient(stops) {
	return function (moreProps, ctx) {
		var height = moreProps.chartConfig.height;


		var grd = ctx.createLinearGradient(0, height, 0, 0);
		stops.forEach(function (each) {
			grd.addColorStop(each.stop, each.color);
		});

		return grd;
	};
}

function getClosestItemIndexes2(array, value, accessor) {
	var left = (0, _d3Array.bisector)(accessor).left(array, value);
	left = Math.max(left - 1, 0);
	var right = Math.min(left + 1, array.length - 1);

	var item = accessor(array[left]);
	if (item >= value && item <= value) right = left;

	return { left: left, right: right };
}

function degrees(radians) {
	return radians * 180 / Math.PI;
}

function radians(degrees) {
	return degrees * Math.PI / 180;
}

function getClosestValue(inputValue, currentValue) {
	var values = isArray(inputValue) ? inputValue : [inputValue];

	var diff = values.map(function (each) {
		return each - currentValue;
	}).reduce(function (diff1, diff2) {
		return Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2;
	});
	return currentValue + diff;
}

function find(list, predicate) {
	var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

	for (var i = 0; i < list.length; ++i) {
		if (predicate.call(context, list[i], i, list)) {
			return list[i];
		}
	}
	return undefined;
}

function d3Window(node) {
	var d3win = node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
	return d3win;
}

var MOUSEENTER = exports.MOUSEENTER = "mouseenter.interaction";
var MOUSELEAVE = exports.MOUSELEAVE = "mouseleave.interaction";
var MOUSEMOVE = exports.MOUSEMOVE = "mousemove.pan";
var MOUSEUP = exports.MOUSEUP = "mouseup.pan";
var TOUCHMOVE = exports.TOUCHMOVE = "touchmove.pan";
var TOUCHEND = exports.TOUCHEND = "touchend.pan touchcancel.pan";

function getTouchProps(touch) {
	if (!touch) return {};
	return {
		pageX: touch.pageX,
		pageY: touch.pageY,
		clientX: touch.clientX,
		clientY: touch.clientY
	};
}

function getClosestItemIndexes(array, value, accessor, log) {
	var lo = 0,
	    hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi) / 2);
		if (accessor(array[mid]) <= value) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	// for Date object === does not work, so using the <= in combination with >=
	// the same code works for both dates and numbers
	if (accessor(array[lo]).valueOf() === value.valueOf()) hi = lo;
	if (accessor(array[hi]).valueOf() === value.valueOf()) lo = hi;

	if (accessor(array[lo]) < value && accessor(array[hi]) < value) lo = hi;
	if (accessor(array[lo]) > value && accessor(array[hi]) > value) hi = lo;

	if (log) {}
	// console.log(lo, accessor(array[lo]), value, accessor(array[hi]), hi);
	// console.log(accessor(array[lo]), lo, value, accessor(array[lo]) >= value);
	// console.log(value, hi, accessor(array[hi]), accessor(array[lo]) <= value);

	// var left = value > accessor(array[lo]) ? lo : lo;
	// var right = gte(value, accessor(array[hi])) ? Math.min(hi + 1, array.length - 1) : hi;

	// console.log(value, accessor(array[left]), accessor(array[right]));
	return { left: lo, right: hi };
}

function getClosestItem(array, value, accessor, log) {
	var _getClosestItemIndexe = getClosestItemIndexes(array, value, accessor, log),
	    left = _getClosestItemIndexe.left,
	    right = _getClosestItemIndexe.right;

	if (left === right) {
		return array[left];
	}

	var closest = Math.abs(accessor(array[left]) - value) < Math.abs(accessor(array[right]) - value) ? array[left] : array[right];
	if (log) {
		console.log(array[left], array[right], closest, left, right);
	}
	return closest;
}

var overlayColors = exports.overlayColors = (0, _d3Scale.scaleOrdinal)(_d3Scale.schemeCategory10);

function head(array, accessor) {
	if (accessor && array) {
		var value = void 0;
		for (var i = 0; i < array.length; i++) {
			value = array[i];
			if (isDefined(accessor(value))) return value;
		}
		return undefined;
	}
	return array ? array[0] : undefined;
}

function tail(array, accessor) {
	if (accessor && array) {
		return array.map(accessor).slice(1);
	}
	return array ? array.slice(1) : undefined;
}

var first = exports.first = head;

function last(array, accessor) {
	if (accessor && array) {
		var value = void 0;
		for (var i = array.length - 1; i >= 0; i--) {
			value = array[i];
			if (isDefined(accessor(value))) return value;
		}
		return undefined;
	}
	var length = array ? array.length : 0;
	return length ? array[length - 1] : undefined;
}

function isDefined(d) {
	return d !== null && typeof d != "undefined";
}

function isNotDefined(d) {
	return !isDefined(d);
}

function isObject(d) {
	return isDefined(d) && (typeof d === "undefined" ? "undefined" : _typeof(d)) === "object" && !Array.isArray(d);
}

var isArray = exports.isArray = Array.isArray;

function touchPosition(touch, e) {
	var container = e.target,
	    rect = container.getBoundingClientRect(),
	    x = touch.clientX - rect.left - container.clientLeft,
	    y = touch.clientY - rect.top - container.clientTop,
	    xy = [Math.round(x), Math.round(y)];
	return xy;
}

function mousePosition(e, defaultRect) {
	var container = e.currentTarget;
	var rect = defaultRect || container.getBoundingClientRect(),
	    x = e.clientX - rect.left - container.clientLeft,
	    y = e.clientY - rect.top - container.clientTop,
	    xy = [Math.round(x), Math.round(y)];
	return xy;
}

function clearCanvas(canvasList, ratio) {
	canvasList.forEach(function (each) {
		each.setTransform(1, 0, 0, 1, 0, 0);
		each.clearRect(-1, -1, each.canvas.width + 2, each.canvas.height + 2);
		each.scale(ratio, ratio);
	});
}

function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

function hexToRGBA(inputHex, opacity) {
	var hex = inputHex.replace("#", "");
	if (inputHex.indexOf("#") > -1 && (hex.length === 3 || hex.length === 6)) {

		var multiplier = hex.length === 3 ? 1 : 2;

		var r = parseInt(hex.substring(0, 1 * multiplier), 16);
		var g = parseInt(hex.substring(1 * multiplier, 2 * multiplier), 16);
		var b = parseInt(hex.substring(2 * multiplier, 3 * multiplier), 16);

		var result = "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";

		return result;
	}
	return inputHex;
}

function toObject(array) {
	var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _identity2.default;

	return array.reduce(function (returnObj, a) {
		var _iteratee = iteratee(a),
		    _iteratee2 = _slicedToArray(_iteratee, 2),
		    key = _iteratee2[0],
		    value = _iteratee2[1];

		return _extends({}, returnObj, _defineProperty({}, key, value));
	}, {});
}

// copied from https://github.com/lodash/lodash/blob/master/mapValue.js
function mapValue(object, iteratee) {
	object = Object(object);
	// eslint-disable-next-line prefer-const
	var result = {};

	Object.keys(object).forEach(function (key) {
		var mappedValue = iteratee(object[key], key, object);

		if (isDefined(mappedValue)) {
			result[key] = mappedValue;
		}
	});
	return result;
}

// copied from https://github.com/lodash/lodash/blob/master/mapObject.js
function mapObject() {
	var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _identity2.default;

	var props = Object.keys(object);

	// eslint-disable-next-line prefer-const
	var result = new Array(props.length);

	props.forEach(function (key, index) {
		result[index] = iteratee(object[key], key, object);
	});
	return result;
}

function replaceAtIndex(array, index, value) {
	if (isDefined(array) && array.length > index) {
		return array.slice(0, index).concat(value).concat(array.slice(index + 1));
	}
	return array;
}

// copied from https://github.com/lodash/lodash/blob/master/forOwn.js
function forOwn(obj, iteratee) {
	var object = Object(obj);
	Object.keys(object).forEach(function (key) {
		return iteratee(object[key], key, object);
	});
}
//# sourceMappingURL=index.js.map