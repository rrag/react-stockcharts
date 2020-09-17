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

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SARSeries = function (_Component) {
	_inherits(SARSeries, _Component);

	function SARSeries(props) {
		_classCallCheck(this, SARSeries);

		var _this = _possibleConstructorReturn(this, (SARSeries.__proto__ || Object.getPrototypeOf(SARSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(SARSeries, [{
		key: "isHover",
		value: function isHover(moreProps) {
			var mouseXY = moreProps.mouseXY,
			    currentItem = moreProps.currentItem,
			    yScale = moreProps.chartConfig.yScale;
			var yAccessor = this.props.yAccessor;

			var y = mouseXY[1];
			var currentY = yScale(yAccessor(currentItem));
			return y < currentY + 5 && y > currentY - 5;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props = this.props,
			    yAccessor = _props.yAccessor,
			    fill = _props.fill,
			    opacity = _props.opacity;
			var xAccessor = moreProps.xAccessor,
			    plotData = moreProps.plotData,
			    xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    hovering = moreProps.hovering;


			var width = xScale(xAccessor((0, _utils.last)(plotData))) - xScale(xAccessor((0, _utils.first)(plotData)));

			var d = width / plotData.length * 0.5 / 2;
			var radius = Math.min(2, Math.max(0.5, d)) + (hovering ? 2 : 0);

			plotData.forEach(function (each) {
				var centerX = xScale(xAccessor(each));
				var centerY = yScale(yAccessor(each));
				var color = yAccessor(each) > each.close ? fill.falling : fill.rising;

				ctx.fillStyle = (0, _utils.hexToRGBA)(color, opacity);
				ctx.strokeStyle = color;

				ctx.beginPath();
				ctx.ellipse(centerX, centerY, radius, radius, 0, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props2 = this.props,
			    className = _props2.className,
			    yAccessor = _props2.yAccessor;
			var xAccessor = moreProps.xAccessor,
			    plotData = moreProps.plotData,
			    xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale;
			// console.log(moreProps);

			return _react2.default.createElement(
				"g",
				{ className: className },
				plotData.filter(function (each) {
					return (0, _utils.isDefined)(yAccessor(each));
				}).map(function (each, idx) {
					return _react2.default.createElement("circle", { key: idx, cx: xScale(xAccessor(each)),
						cy: yScale(yAccessor(each)), r: 3, fill: "green" });
				})
			);
		}
	}, {
		key: "render",
		value: function render() {
			var highlightOnHover = this.props.highlightOnHover;

			var hoverProps = highlightOnHover ? {
				isHover: this.isHover,
				drawOn: ["mousemove", "pan"],
				canvasToDraw: _GenericComponent.getMouseCanvas
			} : {
				drawOn: ["pan"],
				canvasToDraw: _GenericComponent.getAxisCanvas
			};

			return _react2.default.createElement(_GenericChartComponent2.default, _extends({
				svgDraw: this.renderSVG,

				canvasDraw: this.drawOnCanvas,

				onClickWhenHover: this.props.onClick,
				onDoubleClickWhenHover: this.props.onDoubleClick,
				onContextMenuWhenHover: this.props.onContextMenu
			}, hoverProps));
		}
	}]);

	return SARSeries;
}(_react.Component);

SARSeries.propTypes = {
	className: _propTypes2.default.string,
	fill: _propTypes2.default.object.isRequired,
	yAccessor: _propTypes2.default.func.isRequired,
	opacity: _propTypes2.default.number.isRequired,
	onClick: _propTypes2.default.func,
	onDoubleClick: _propTypes2.default.func,
	onContextMenu: _propTypes2.default.func,
	highlightOnHover: _propTypes2.default.bool
};

SARSeries.defaultProps = {
	className: "react-stockcharts-sar",
	fill: {
		falling: "#4682B4",
		rising: "#15EC2E"
	},
	highlightOnHover: true,
	opacity: 0.2,
	onClick: function onClick(e) {
		console.log("Click", e);
	},
	onDoubleClick: function onDoubleClick(e) {
		console.log("Double Click", e);
	},
	onContextMenu: function onContextMenu(e) {
		console.log("Right Click", e);
	}
};

exports.default = SARSeries;
//# sourceMappingURL=SARSeries.js.map