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

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InteractiveText = function (_Component) {
	_inherits(InteractiveText, _Component);

	function InteractiveText(props) {
		_classCallCheck(this, InteractiveText);

		var _this = _possibleConstructorReturn(this, (InteractiveText.__proto__ || Object.getPrototypeOf(InteractiveText)).call(this, props));

		_this.calculateTextWidth = true;

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(InteractiveText, [{
		key: "isHover",
		value: function isHover(moreProps) {
			var onHover = this.props.onHover;


			if ((0, _utils.isDefined)(onHover) && (0, _utils.isDefined)(this.textWidth) && !this.calculateTextWidth) {
				var _helper = helper(this.props, moreProps, this.textWidth),
				    rect = _helper.rect;

				var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
				    x = _moreProps$mouseXY[0],
				    y = _moreProps$mouseXY[1];

				if (x >= rect.x && y >= rect.y && x <= rect.x + rect.width && y <= rect.y + rect.height) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			this.calculateTextWidth = nextProps.text !== this.props.text || nextProps.fontStyle !== this.props.fontStyle || nextProps.fontWeight !== this.props.fontWeight || nextProps.fontSize !== this.props.fontSize || nextProps.fontFamily !== this.props.fontFamily;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    bgFill = _props.bgFill,
			    bgOpacity = _props.bgOpacity,
			    bgStrokeWidth = _props.bgStrokeWidth,
			    bgStroke = _props.bgStroke,
			    textFill = _props.textFill,
			    fontFamily = _props.fontFamily,
			    fontSize = _props.fontSize,
			    fontStyle = _props.fontStyle,
			    fontWeight = _props.fontWeight,
			    text = _props.text;


			if (this.calculateTextWidth) {
				ctx.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;

				var _ctx$measureText = ctx.measureText(text),
				    width = _ctx$measureText.width;

				this.textWidth = width;
				this.calculateTextWidth = false;
			}

			var selected = this.props.selected;

			var _helper2 = helper(this.props, moreProps, this.textWidth),
			    x = _helper2.x,
			    y = _helper2.y,
			    rect = _helper2.rect;

			ctx.fillStyle = (0, _utils.hexToRGBA)(bgFill, bgOpacity);

			ctx.beginPath();
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

			if (selected) {
				ctx.strokeStyle = bgStroke;
				ctx.lineWidth = bgStrokeWidth;
				ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
			}

			ctx.fillStyle = textFill;
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;

			ctx.beginPath();
			ctx.fillText(text, x, y);
		}
	}, {
		key: "renderSVG",
		value: function renderSVG() {
			throw new Error("svg not implemented");
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props,
			    selected = _props2.selected,
			    interactiveCursorClass = _props2.interactiveCursorClass;
			var _props3 = this.props,
			    onHover = _props3.onHover,
			    onUnHover = _props3.onUnHover;
			var _props4 = this.props,
			    onDragStart = _props4.onDragStart,
			    onDrag = _props4.onDrag,
			    onDragComplete = _props4.onDragComplete;


			return _react2.default.createElement(_GenericChartComponent2.default, {
				isHover: this.isHover,

				svgDraw: this.renderSVG,
				canvasToDraw: _GenericComponent.getMouseCanvas,
				canvasDraw: this.drawOnCanvas,

				interactiveCursorClass: interactiveCursorClass,
				selected: selected,

				onDragStart: onDragStart,
				onDrag: onDrag,
				onDragComplete: onDragComplete,
				onHover: onHover,
				onUnHover: onUnHover,

				drawOn: ["mousemove", "mouseleave", "pan", "drag"]
			});
		}
	}]);

	return InteractiveText;
}(_react.Component);

function helper(props, moreProps, textWidth) {
	var position = props.position,
	    fontSize = props.fontSize;
	var xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale;

	var _position = _slicedToArray(position, 2),
	    xValue = _position[0],
	    yValue = _position[1];

	var x = xScale(xValue);
	var y = yScale(yValue);

	var rect = {
		x: x - textWidth / 2 - fontSize,
		y: y - fontSize,
		width: textWidth + fontSize * 2,
		height: fontSize * 2
	};

	return {
		x: x, y: y, rect: rect
	};
}

InteractiveText.propTypes = {
	bgFill: _propTypes2.default.string.isRequired,
	bgOpacity: _propTypes2.default.number.isRequired,
	bgStrokeWidth: _propTypes2.default.number.isRequired,
	bgStroke: _propTypes2.default.string.isRequired,

	textFill: _propTypes2.default.string.isRequired,
	fontFamily: _propTypes2.default.string.isRequired,
	fontSize: _propTypes2.default.number.isRequired,
	fontWeight: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired,
	fontStyle: _propTypes2.default.string.isRequired,

	text: _propTypes2.default.string.isRequired,

	onDragStart: _propTypes2.default.func.isRequired,
	onDrag: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired,
	onHover: _propTypes2.default.func,
	onUnHover: _propTypes2.default.func,

	defaultClassName: _propTypes2.default.string,
	interactiveCursorClass: _propTypes2.default.string,

	tolerance: _propTypes2.default.number.isRequired,
	selected: _propTypes2.default.bool.isRequired
};

InteractiveText.defaultProps = {
	onDragStart: _utils.noop,
	onDrag: _utils.noop,
	onDragComplete: _utils.noop,

	type: "SD", // standard dev
	fontWeight: "normal", // standard dev

	tolerance: 4,
	selected: false
};

exports.default = InteractiveText;
//# sourceMappingURL=InteractiveText.js.map