"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GenericChartComponent = require("../../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../../GenericComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Text = function (_Component) {
	_inherits(Text, _Component);

	function Text(props) {
		_classCallCheck(this, Text);

		var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(Text, [{
		key: "isHover",
		value: function isHover() {
			return false;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    xyProvider = _props.xyProvider,
			    fontFamily = _props.fontFamily,
			    fontSize = _props.fontSize,
			    fill = _props.fill,
			    children = _props.children;

			var _xyProvider = xyProvider(moreProps),
			    _xyProvider2 = _slicedToArray(_xyProvider, 2),
			    x = _xyProvider2[0],
			    y = _xyProvider2[1];

			ctx.font = fontSize + "px " + fontFamily;
			ctx.fillStyle = fill;

			ctx.beginPath();
			ctx.fillText(children, x, y);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props2 = this.props,
			    xyProvider = _props2.xyProvider,
			    fontFamily = _props2.fontFamily,
			    fontSize = _props2.fontSize,
			    fill = _props2.fill,
			    children = _props2.children;

			var _xyProvider3 = xyProvider(moreProps),
			    _xyProvider4 = _slicedToArray(_xyProvider3, 2),
			    x = _xyProvider4[0],
			    y = _xyProvider4[1];

			return _react2.default.createElement(
				"text",
				{
					x: x,
					y: y,
					fontFamily: fontFamily,
					fontSize: fontSize,
					fill: fill },
				children
			);
		}
	}, {
		key: "render",
		value: function render() {
			var selected = this.props.selected;


			return _react2.default.createElement(_GenericChartComponent2.default, {
				selected: selected,

				svgDraw: this.renderSVG,

				canvasToDraw: _GenericComponent.getMouseCanvas,
				canvasDraw: this.drawOnCanvas,

				drawOn: ["mousemove", "pan", "drag"]
			});
		}
	}]);

	return Text;
}(_react.Component);

Text.propTypes = {
	xyProvider: _propTypes2.default.func.isRequired,
	fontFamily: _propTypes2.default.string.isRequired,
	fontSize: _propTypes2.default.number.isRequired,
	fill: _propTypes2.default.string.isRequired,
	children: _propTypes2.default.string.isRequired,
	selected: _propTypes2.default.bool.isRequired
};

Text.defaultProps = {
	selected: false
};

exports.default = Text;
//# sourceMappingURL=Text.js.map