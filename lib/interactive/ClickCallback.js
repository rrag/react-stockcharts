"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../utils");

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClickCallback = function (_Component) {
	_inherits(ClickCallback, _Component);

	function ClickCallback() {
		_classCallCheck(this, ClickCallback);

		return _possibleConstructorReturn(this, (ClickCallback.__proto__ || Object.getPrototypeOf(ClickCallback)).apply(this, arguments));
	}

	_createClass(ClickCallback, [{
		key: "render",
		value: function render() {
			var _props = this.props,
			    onMouseDown = _props.onMouseDown,
			    onClick = _props.onClick,
			    onDoubleClick = _props.onDoubleClick,
			    onContextMenu = _props.onContextMenu,
			    onMouseMove = _props.onMouseMove,
			    onPan = _props.onPan,
			    onPanEnd = _props.onPanEnd;


			return _react2.default.createElement(_GenericChartComponent2.default, {

				onMouseDown: onMouseDown,
				onClick: onClick,
				onDoubleClick: onDoubleClick,
				onContextMenu: onContextMenu,
				onMouseMove: onMouseMove,
				onPan: onPan,
				onPanEnd: onPanEnd,

				svgDraw: _utils.noop,
				canvasDraw: _utils.noop,
				canvasToDraw: _GenericComponent.getMouseCanvas,

				drawOn: ["mousemove", "pan"]
			});
		}
	}]);

	return ClickCallback;
}(_react.Component);

ClickCallback.propTypes = {
	disablePan: _propTypes2.default.bool.isRequired,
	onMouseDown: _propTypes2.default.func,
	onClick: _propTypes2.default.func,
	onDoubleClick: _propTypes2.default.func,
	onContextMenu: _propTypes2.default.func,
	onMouseMove: _propTypes2.default.func,
	onPan: _propTypes2.default.func,
	onPanEnd: _propTypes2.default.func
};

ClickCallback.defaultProps = {
	disablePan: false
};

exports.default = ClickCallback;
//# sourceMappingURL=ClickCallback.js.map