"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _utils = require("../utils");

var _GenericComponent = require("../GenericComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CurrentCoordinate = function (_Component) {
	_inherits(CurrentCoordinate, _Component);

	function CurrentCoordinate(props) {
		_classCallCheck(this, CurrentCoordinate);

		var _this = _possibleConstructorReturn(this, (CurrentCoordinate.__proto__ || Object.getPrototypeOf(CurrentCoordinate)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(CurrentCoordinate, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var circle = helper(this.props, moreProps);
			if (!circle) return null;

			ctx.fillStyle = circle.fill;
			ctx.beginPath();
			ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var className = this.props.className;


			var circle = helper(this.props, moreProps);
			if (!circle) return null;

			var fillColor = circle.fill instanceof Function ? circle.fill(moreProps.currentItem) : circle.fill;

			return _react2.default.createElement("circle", { className: className, cx: circle.x, cy: circle.y, r: circle.r, fill: fillColor });
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getMouseCanvas,
				drawOn: ["mousemove", "pan"]
			});
		}
	}]);

	return CurrentCoordinate;
}(_react.Component);

CurrentCoordinate.propTypes = {
	yAccessor: _propTypes2.default.func,
	r: _propTypes2.default.number.isRequired,
	className: _propTypes2.default.string
};

CurrentCoordinate.defaultProps = {
	r: 3,
	className: "react-stockcharts-current-coordinate"
};

function helper(props, moreProps) {
	var fill = props.fill,
	    yAccessor = props.yAccessor,
	    r = props.r;
	var show = moreProps.show,
	    xScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    currentItem = moreProps.currentItem,
	    xAccessor = moreProps.xAccessor;

	// console.log(show);

	if (!show || (0, _utils.isNotDefined)(currentItem)) return null;

	var xValue = xAccessor(currentItem);
	var yValue = yAccessor(currentItem);

	if ((0, _utils.isNotDefined)(yValue)) return null;

	// console.log(chartConfig);
	var x = Math.round(xScale(xValue));
	var y = Math.round(yScale(yValue));

	return { x: x, y: y, r: r, fill: fill };
}

exports.default = CurrentCoordinate;
//# sourceMappingURL=CurrentCoordinate.js.map