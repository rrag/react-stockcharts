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

var _StraightLine = require("./StraightLine");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClickableShape = function (_Component) {
	_inherits(ClickableShape, _Component);

	function ClickableShape(props) {
		_classCallCheck(this, ClickableShape);

		var _this = _possibleConstructorReturn(this, (ClickableShape.__proto__ || Object.getPrototypeOf(ClickableShape)).call(this, props));

		_this.saveNode = _this.saveNode.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(ClickableShape, [{
		key: "saveNode",
		value: function saveNode(node) {
			this.node = node;
		}
	}, {
		key: "isHover",
		value: function isHover(moreProps) {
			var mouseXY = moreProps.mouseXY;

			if (this.closeIcon) {
				var textBox = this.props.textBox;
				var _closeIcon = this.closeIcon,
				    x = _closeIcon.x,
				    y = _closeIcon.y;

				var halfWidth = textBox.closeIcon.width / 2;

				var start1 = [x - halfWidth, y - halfWidth];
				var end1 = [x + halfWidth, y + halfWidth];
				var start2 = [x - halfWidth, y + halfWidth];
				var end2 = [x + halfWidth, y - halfWidth];

				if ((0, _StraightLine.isHovering2)(start1, end1, mouseXY, 3) || (0, _StraightLine.isHovering2)(start2, end2, mouseXY, 3)) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    stroke = _props.stroke,
			    strokeWidth = _props.strokeWidth,
			    strokeOpacity = _props.strokeOpacity,
			    hovering = _props.hovering,
			    textBox = _props.textBox;

			var _helper = helper(this.props, moreProps, ctx),
			    _helper2 = _slicedToArray(_helper, 2),
			    x = _helper2[0],
			    y = _helper2[1];

			this.closeIcon = { x: x, y: y };
			ctx.beginPath();

			ctx.lineWidth = hovering ? strokeWidth + 1 : strokeWidth;
			ctx.strokeStyle = (0, _utils.hexToRGBA)(stroke, strokeOpacity);
			var halfWidth = textBox.closeIcon.width / 2;
			ctx.moveTo(x - halfWidth, y - halfWidth);
			ctx.lineTo(x + halfWidth, y + halfWidth);
			ctx.moveTo(x - halfWidth, y + halfWidth);
			ctx.lineTo(x + halfWidth, y - halfWidth);
			ctx.stroke();
		}
	}, {
		key: "renderSVG",
		value: function renderSVG() {
			throw new Error("svg not implemented");
		}
	}, {
		key: "render",
		value: function render() {
			var interactiveCursorClass = this.props.interactiveCursorClass;
			var show = this.props.show;
			var _props2 = this.props,
			    onHover = _props2.onHover,
			    onUnHover = _props2.onUnHover,
			    onClick = _props2.onClick;


			return show ? _react2.default.createElement(_GenericChartComponent2.default, { ref: this.saveNode,
				interactiveCursorClass: interactiveCursorClass,
				isHover: this.isHover,

				onClickWhenHover: onClick,

				svgDraw: this.renderSVG,

				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getMouseCanvas,

				onHover: onHover,
				onUnHover: onUnHover,

				drawOn: ["pan", "mousemove", "drag"]
			}) : null;
		}
	}]);

	return ClickableShape;
}(_react.Component);

function helper(props, moreProps, ctx) {
	var yValue = props.yValue,
	    text = props.text,
	    textBox = props.textBox;
	var fontFamily = props.fontFamily,
	    fontStyle = props.fontStyle,
	    fontWeight = props.fontWeight,
	    fontSize = props.fontSize;

	ctx.font = fontStyle + " " + fontWeight + " " + fontSize + "px " + fontFamily;

	var yScale = moreProps.chartConfig.yScale;


	var x = textBox.left + textBox.padding.left + ctx.measureText(text).width + textBox.padding.right + textBox.closeIcon.padding.left + textBox.closeIcon.width / 2;

	var y = yScale(yValue);

	return [x, y];
}

ClickableShape.propTypes = {
	stroke: _propTypes2.default.string.isRequired,
	strokeOpacity: _propTypes2.default.number.isRequired,
	strokeWidth: _propTypes2.default.number.isRequired,
	textBox: _propTypes2.default.object.isRequired,
	hovering: _propTypes2.default.bool,
	interactiveCursorClass: _propTypes2.default.string,
	show: _propTypes2.default.bool,
	onHover: _propTypes2.default.func,
	onUnHover: _propTypes2.default.func,
	onClick: _propTypes2.default.func
};

ClickableShape.defaultProps = {
	show: false,
	fillOpacity: 1,
	strokeOpacity: 1,
	strokeWidth: 1
};

exports.default = ClickableShape;
//# sourceMappingURL=ClickableShape.js.map