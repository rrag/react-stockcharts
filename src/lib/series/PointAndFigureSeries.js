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

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PointAndFigureSeries = function (_Component) {
	_inherits(PointAndFigureSeries, _Component);

	function PointAndFigureSeries(props) {
		_classCallCheck(this, PointAndFigureSeries);

		var _this = _possibleConstructorReturn(this, (PointAndFigureSeries.__proto__ || Object.getPrototypeOf(PointAndFigureSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(PointAndFigureSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData;

			var columns = getColumns(xScale, xAccessor, yScale, plotData);

			_drawOnCanvas(ctx, this.props, columns);
		}
	}, {
		key: "render",
		value: function render() {
			var clip = this.props.clip;


			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: clip,
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var xAccessor = moreProps.xAccessor;
			var xScale = moreProps.xScale,
			    yScale = moreProps.chartConfig.yScale,
			    plotData = moreProps.plotData;
			var _props = this.props,
			    stroke = _props.stroke,
			    fill = _props.fill,
			    strokeWidth = _props.strokeWidth,
			    className = _props.className;


			var columns = getColumns(xScale, xAccessor, yScale, plotData);

			return _react2.default.createElement(
				"g",
				{ className: className },
				columns.map(function (col, idx) {
					return _react2.default.createElement(
						"g",
						{ key: idx, className: col.className, transform: "translate(" + col.offset[0] + ", " + col.offset[1] + ")" },
						col.boxes.map(function (box, i) {
							if (col.direction > 0) {
								return _react2.default.createElement(
									"g",
									{ key: idx + "-" + i },
									_react2.default.createElement("line", { className: "up", strokeWidth: strokeWidth, stroke: stroke.up, fill: fill.up,
										x1: 0, y1: box.open, x2: box.columnWidth, y2: box.close }),
									_react2.default.createElement("line", { className: "up", strokeWidth: strokeWidth, stroke: stroke.up, fill: fill.up,
										x1: 0, y1: box.close, x2: box.columnWidth, y2: box.open })
								);
							}
							return _react2.default.createElement("ellipse", { key: idx + "-" + i,
								className: "down", strokeWidth: strokeWidth, stroke: stroke.down, fill: fill.down,
								cx: box.columnWidth / 2, cy: (box.open + box.close) / 2,
								rx: box.columnWidth / 2, ry: box.boxHeight / 2 });
						})
					);
				})
			);
		}
	}]);

	return PointAndFigureSeries;
}(_react.Component);

PointAndFigureSeries.propTypes = {
	className: _propTypes2.default.string,
	strokeWidth: _propTypes2.default.number.isRequired,
	stroke: _propTypes2.default.object.isRequired,
	fill: _propTypes2.default.object.isRequired,
	clip: _propTypes2.default.bool.isRequired
};

PointAndFigureSeries.defaultProps = {
	className: "react-stockcharts-point-and-figure",
	strokeWidth: 1,
	stroke: {
		up: "#6BA583",
		down: "#FF0000"
	},
	fill: {
		up: "none",
		down: "none"
	},
	clip: true
};

function _drawOnCanvas(ctx, props, columns) {
	var stroke = props.stroke,
	    fill = props.fill,
	    strokeWidth = props.strokeWidth;


	ctx.lineWidth = strokeWidth;

	columns.forEach(function (col) {
		var _col$offset = _slicedToArray(col.offset, 2),
		    offsetX = _col$offset[0],
		    offsetY = _col$offset[1];

		col.boxes.forEach(function (box) {
			if (col.direction > 0) {
				ctx.fillStyle = fill.up;
				ctx.strokeStyle = stroke.up;

				ctx.beginPath();

				ctx.moveTo(offsetX, offsetY + box.open);
				ctx.lineTo(offsetX + box.columnWidth, offsetY + box.close);
				ctx.moveTo(offsetX, offsetY + box.close);
				ctx.lineTo(offsetX + box.columnWidth, offsetY + box.open);

				ctx.stroke();
			} else {
				ctx.fillStyle = fill.down;
				ctx.strokeStyle = stroke.down;

				ctx.beginPath();

				var x = offsetX + box.columnWidth / 2,
				    y = offsetY + box.open + box.boxHeight / 2;
				var rx = box.columnWidth / 2,
				    ry = box.boxHeight / 2;


				ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
				ctx.stroke();
			}
		});
	});

	ctx.stroke();
}

function getColumns(xScale, xAccessor, yScale, plotData) {

	var width = xScale(xAccessor(plotData[plotData.length - 1])) - xScale(xAccessor(plotData[0]));

	var columnWidth = width / (plotData.length - 1);

	var anyBox = void 0,
	    j = 0;
	while ((0, _utils.isNotDefined)(anyBox)) {
		if ((0, _utils.isDefined)(plotData[j].close)) {
			anyBox = plotData[j].boxes[0];
		} else {
			break;
		}
		j++;
	}

	var boxHeight = Math.abs(yScale(anyBox.open) - yScale(anyBox.close));

	var columns = plotData.filter(function (d) {
		return (0, _utils.isDefined)(d.close);
	}).map(function (d) {
		var boxes = d.boxes.map(function (box) {
			return {
				columnWidth: columnWidth,
				boxHeight: boxHeight,
				open: yScale(box.open),
				close: yScale(box.close)
			};
		});

		var xOffset = xScale(xAccessor(d)) - columnWidth / 2;
		return {
			boxes: boxes,
			direction: d.direction,
			offset: [xOffset, 0]
		};
	});
	return columns;
}

exports.default = PointAndFigureSeries;
//# sourceMappingURL=PointAndFigureSeries.js.map