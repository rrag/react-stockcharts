"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = rebind;
// copied from https://github.com/d3fc/d3fc-rebind/blob/master/src/rebind.js

function createReboundMethod(target, source, name) {
	var method = source[name];
	if (typeof method !== "function") {
		throw new Error("Attempt to rebind " + name + " which isn't a function on the source object");
	}
	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var value = method.apply(source, args);
		return value === source ? target : value;
	};
}

function rebind(target, source) {
	for (var _len2 = arguments.length, names = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
		names[_key2 - 2] = arguments[_key2];
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var name = _step.value;

			target[name] = createReboundMethod(target, source, name);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return target;
}
//# sourceMappingURL=rebind.js.map