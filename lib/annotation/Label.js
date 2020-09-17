"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GenericComponent = require("../GenericComponent");

var _GenericComponent2 = _interopRequireDefault(_GenericComponent);

var _utils = require("../utils");

var _LabelAnnotation = require("./LabelAnnotation");

var _LabelAnnotation2 = _interopRequireDefault(_LabelAnnotation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Label = function (_Component) {
	_inherits(Label, _Component);

	function Label(props) {
		_classCallCheck(this, Label);

		var _this = _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(Label, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			drawOnCanvas2(ctx, this.props, this.context, moreProps);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericComponent2.default, {
				canvasToDraw: this.props.selectCanvas,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				drawOn: []
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var chartConfig = moreProps.chartConfig;


			return _react2.default.createElement(_LabelAnnotation2.default, _extends({ yScale: getYScale(chartConfig) }, this.props, { text: getText(this.props) }));
		}
	}]);

	return Label;
}(_react.Component);

function getText(props) {
	return (0, _utils.functor)(props.text)(props);
}

function getYScale(chartConfig) {
	return Array.isArray(chartConfig) ? undefined : chartConfig.yScale;
}

Label.propTypes = {
	className: _propTypes2.default.string,
	selectCanvas: _propTypes2.default.func,
	text: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired,
	textAnchor: _propTypes2.default.string,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	opacity: _propTypes2.default.number,
	rotate: _propTypes2.default.number,
	onClick: _propTypes2.default.func,
	xAccessor: _propTypes2.default.func,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func,
	datum: _propTypes2.default.object,
	x: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	y: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func])
};

Label.contextTypes = {
	canvasOriginX: _propTypes2.default.number,
	canvasOriginY: _propTypes2.default.number,

	margin: _propTypes2.default.object.isRequired,
	ratio: _propTypes2.default.number.isRequired
};

Label.defaultProps = _extends({}, _LabelAnnotation.defaultProps, {
	selectCanvas: function selectCanvas(canvases) {
		return canvases.bg;
	}
});

function drawOnCanvas2(ctx, props, context, moreProps) {
	ctx.save();

	var canvasOriginX = context.canvasOriginX,
	    canvasOriginY = context.canvasOriginY,
	    margin = context.margin,
	    ratio = context.ratio;

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.scale(ratio, ratio);

	if ((0, _utils.isDefined)(canvasOriginX)) ctx.translate(canvasOriginX, canvasOriginY);else ctx.translate(margin.left + 0.5 * ratio, margin.top + 0.5 * ratio);

	drawOnCanvas(ctx, props, moreProps);

	ctx.restore();
}

function drawOnCanvas(ctx, props, moreProps) {
	var textAnchor = props.textAnchor,
	    fontFamily = props.fontFamily,
	    fontSize = props.fontSize,
	    opacity = props.opacity,
	    rotate = props.rotate;
	var xScale = moreProps.xScale,
	    chartConfig = moreProps.chartConfig,
	    xAccessor = moreProps.xAccessor;

	var _helper = (0, _LabelAnnotation.helper)(props, xAccessor, xScale, getYScale(chartConfig)),
	    xPos = _helper.xPos,
	    yPos = _helper.yPos,
	    fill = _helper.fill,
	    text = _helper.text;

	var radians = rotate / 180 * Math.PI;
	ctx.save();
	ctx.translate(xPos, yPos);
	ctx.rotate(radians);

	ctx.font = fontSize + "px " + fontFamily;
	ctx.fillStyle = (0, _utils.hexToRGBA)(fill, opacity);
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	ctx.beginPath();
	ctx.fillText(text, 0, 0);
	ctx.restore();
}

exports.default = Label;
//# sourceMappingURL=Label.js.map