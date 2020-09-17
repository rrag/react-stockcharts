"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Array = require("d3-array");

var _d3Collection = require("d3-collection");

var _d3Scale = require("d3-scale");

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../GenericComponent");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VolumeProfileSeries = function (_Component) {
	_inherits(VolumeProfileSeries, _Component);

	function VolumeProfileSeries(props) {
		_classCallCheck(this, VolumeProfileSeries);

		var _this = _possibleConstructorReturn(this, (VolumeProfileSeries.__proto__ || Object.getPrototypeOf(VolumeProfileSeries)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		return _this;
	}

	_createClass(VolumeProfileSeries, [{
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var xAccessor = moreProps.xAccessor,
			    width = moreProps.width;

			var _helper = helper(this.props, moreProps, xAccessor, width),
			    rects = _helper.rects,
			    sessionBg = _helper.sessionBg;

			_drawOnCanvas(ctx, this.props, rects, sessionBg);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				svgDraw: this.renderSVG,
				canvasDraw: this.drawOnCanvas,
				canvasToDraw: _GenericComponent.getAxisCanvas,
				drawOn: ["pan"]
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props = this.props,
			    className = _props.className,
			    opacity = _props.opacity;
			var _props2 = this.props,
			    showSessionBackground = _props2.showSessionBackground,
			    sessionBackGround = _props2.sessionBackGround,
			    sessionBackGroundOpacity = _props2.sessionBackGroundOpacity;
			var xAccessor = moreProps.xAccessor,
			    width = moreProps.width;

			var _helper2 = helper(this.props, moreProps, xAccessor, width),
			    rects = _helper2.rects,
			    sessionBg = _helper2.sessionBg;

			var sessionBgSvg = showSessionBackground ? sessionBg.map(function (d, idx) {
				return _react2.default.createElement("rect", _extends({ key: idx }, d, { opacity: sessionBackGroundOpacity, fill: sessionBackGround }));
			}) : null;

			return _react2.default.createElement(
				"g",
				{ className: className },
				sessionBgSvg,
				rects.map(function (d, i) {
					return _react2.default.createElement(
						"g",
						{ key: i },
						_react2.default.createElement("rect", { x: d.x, y: d.y,
							width: d.w1, height: d.height,
							fill: d.fill1, stroke: d.stroke1, fillOpacity: opacity }),
						_react2.default.createElement("rect", { x: d.x + d.w1, y: d.y,
							width: d.w2, height: d.height,
							fill: d.fill2, stroke: d.stroke2, fillOpacity: opacity })
					);
				})
			);
		}
	}]);

	return VolumeProfileSeries;
}(_react.Component);

VolumeProfileSeries.propTypes = {
	className: _propTypes2.default.string,
	opacity: _propTypes2.default.number,
	showSessionBackground: _propTypes2.default.bool,
	sessionBackGround: _propTypes2.default.string,
	sessionBackGroundOpacity: _propTypes2.default.number
};

VolumeProfileSeries.defaultProps = {
	className: "line ",
	bins: 20,
	opacity: 0.5,
	maxProfileWidthPercent: 50,
	fill: function fill(_ref) {
		var type = _ref.type;
		return type === "up" ? "#6BA583" : "#FF0000";
	},
	stroke: "#FFFFFF",
	showSessionBackground: false,
	sessionBackGround: "#4682B4",
	sessionBackGroundOpacity: 0.3,

	source: function source(d) {
		return d.close;
	},
	volume: function volume(d) {
		return d.volume;
	},
	absoluteChange: function absoluteChange(d) {
		return d.absoluteChange;
	},
	bySession: false,
	/* eslint-disable no-unused-vars */
	sessionStart: function sessionStart(_ref2) {
		var d = _ref2.d,
		    i = _ref2.i,
		    plotData = _ref2.plotData;
		return i > 0 && plotData[i - 1].date.getMonth() !== d.date.getMonth();
	},
	/* eslint-enable no-unused-vars */
	orient: "left",
	// // fill: ({ type }) => { var c = type === "up" ? "#6BA583" : "#FF0000"; console.log(type, c); return c },
	// stroke: ({ type }) =>  type === "up" ? "#6BA583" : "#FF0000",
	// stroke: "none",
	partialStartOK: true,
	partialEndOK: true
};

function helper(props, moreProps, xAccessor, width) {
	var realXScale = moreProps.xScale,
	    yScale = moreProps.chartConfig.yScale,
	    plotData = moreProps.plotData;
	var sessionStart = props.sessionStart,
	    bySession = props.bySession,
	    partialStartOK = props.partialStartOK,
	    partialEndOK = props.partialEndOK;
	var bins = props.bins,
	    maxProfileWidthPercent = props.maxProfileWidthPercent,
	    source = props.source,
	    volume = props.volume,
	    absoluteChange = props.absoluteChange,
	    orient = props.orient,
	    fill = props.fill,
	    stroke = props.stroke;


	var sessionBuilder = (0, _utils.accumulatingWindow)().discardTillStart(!partialStartOK).discardTillEnd(!partialEndOK).accumulateTill(function (d, i) {
		return sessionStart(_extends({ d: d, i: i }, moreProps));
	}).accumulator(_utils.identity);

	var dx = plotData.length > 1 ? realXScale(xAccessor(plotData[1])) - realXScale(xAccessor((0, _utils.head)(plotData))) : 0;

	var sessions = bySession ? sessionBuilder(plotData) : [plotData];

	var allRects = sessions.map(function (session) {

		var begin = bySession ? realXScale(xAccessor((0, _utils.head)(session))) : 0;
		var finish = bySession ? realXScale(xAccessor((0, _utils.last)(session))) : width;
		var sessionWidth = finish - begin + dx;

		// console.log(session)

		/* var histogram = d3.layout.histogram()
  		.value(source)
  		.bins(bins);*/

		var histogram2 = (0, _d3Array.histogram)()
		// .domain(xScale.domain())
		.value(source).thresholds(bins);

		// console.log(bins, histogram(session))
		// console.log(bins, histogram2(session))
		var rollup = (0, _d3Collection.nest)().key(function (d) {
			return d.direction;
		}).sortKeys(orient === "right" ? _d3Array.descending : _d3Array.ascending).rollup(function (leaves) {
			return (0, _d3Array.sum)(leaves, function (d) {
				return d.volume;
			});
		});

		var values = histogram2(session);
		// console.log("values", values)

		var volumeInBins = values.map(function (arr) {
			return arr.map(function (d) {
				return absoluteChange(d) > 0 ? { direction: "up", volume: volume(d) } : { direction: "down", volume: volume(d) };
			});
		}).map(function (arr) {
			return rollup.entries(arr);
		});

		// console.log("volumeInBins", volumeInBins)
		var volumeValues = volumeInBins.map(function (each) {
			return (0, _d3Array.sum)(each.map(function (d) {
				return d.value;
			}));
		});

		// console.log("volumeValues", volumeValues)
		var base = function base(xScale) {
			return (0, _utils.head)(xScale.range());
		};

		var _ref3 = orient === "right" ? [begin, begin + sessionWidth * maxProfileWidthPercent / 100] : [finish, finish - sessionWidth * (100 - maxProfileWidthPercent) / 100],
		    _ref4 = _slicedToArray(_ref3, 2),
		    start = _ref4[0],
		    end = _ref4[1];

		var xScale = (0, _d3Scale.scaleLinear)().domain([0, (0, _d3Array.max)(volumeValues)]).range([start, end]);

		// console.log(xScale.domain())

		var totalVolumes = volumeInBins.map(function (volumes) {

			var totalVolume = (0, _d3Array.sum)(volumes, function (d) {
				return d.value;
			});
			var totalVolumeX = xScale(totalVolume);
			var width = base(xScale) - totalVolumeX;
			var x = width < 0 ? totalVolumeX + width : totalVolumeX;

			var ws = volumes.map(function (d) {
				return {
					type: d.key,
					width: d.value * Math.abs(width) / totalVolume
				};
			});

			return { x: x, ws: ws, totalVolumeX: totalVolumeX };
		});
		// console.log("totalVolumes", totalVolumes)

		var rects = (0, _d3Array.zip)(values, totalVolumes).map(function (_ref5) {
			var _ref6 = _slicedToArray(_ref5, 2),
			    d = _ref6[0],
			    _ref6$ = _ref6[1],
			    x = _ref6$.x,
			    ws = _ref6$.ws;

			var w1 = ws[0] || { type: "up", width: 0 };
			var w2 = ws[1] || { type: "down", width: 0 };

			return {
				// y: yScale(d.x + d.dx),
				y: yScale(d.x1),
				// height: yScale(d.x - d.dx) - yScale(d.x),
				height: yScale(d.x1) - yScale(d.x0),
				x: x,
				width: width,
				w1: w1.width,
				w2: w2.width,
				stroke1: (0, _utils.functor)(stroke)(w1),
				stroke2: (0, _utils.functor)(stroke)(w2),
				fill1: (0, _utils.functor)(fill)(w1),
				fill2: (0, _utils.functor)(fill)(w2)
			};
		});

		// console.log("rects", rects)

		var sessionBg = {
			x: begin,
			y: (0, _utils.last)(rects).y,
			height: (0, _utils.head)(rects).y - (0, _utils.last)(rects).y + (0, _utils.head)(rects).height,
			width: sessionWidth
		};

		return { rects: rects, sessionBg: sessionBg };
	});

	return {
		rects: (0, _d3Array.merge)(allRects.map(function (d) {
			return d.rects;
		})),
		sessionBg: allRects.map(function (d) {
			return d.sessionBg;
		})
	};
}

function _drawOnCanvas(ctx, props, rects, sessionBg) {
	var opacity = props.opacity,
	    sessionBackGround = props.sessionBackGround,
	    sessionBackGroundOpacity = props.sessionBackGroundOpacity,
	    showSessionBackground = props.showSessionBackground;

	// var { rects, sessionBg } = helper(props, xScale, yScale, plotData);

	if (showSessionBackground) {
		ctx.fillStyle = (0, _utils.hexToRGBA)(sessionBackGround, sessionBackGroundOpacity);

		sessionBg.forEach(function (each) {
			var x = each.x,
			    y = each.y,
			    height = each.height,
			    width = each.width;


			ctx.beginPath();
			ctx.rect(x, y, width, height);
			ctx.closePath();
			ctx.fill();
		});
	}

	rects.forEach(function (each) {
		var x = each.x,
		    y = each.y,
		    height = each.height,
		    w1 = each.w1,
		    w2 = each.w2,
		    stroke1 = each.stroke1,
		    stroke2 = each.stroke2,
		    fill1 = each.fill1,
		    fill2 = each.fill2;


		if (w1 > 0) {
			ctx.fillStyle = (0, _utils.hexToRGBA)(fill1, opacity);
			if (stroke1 !== "none") ctx.strokeStyle = stroke1;

			ctx.beginPath();
			ctx.rect(x, y, w1, height);
			ctx.closePath();
			ctx.fill();

			if (stroke1 !== "none") ctx.stroke();
		}

		if (w2 > 0) {
			ctx.fillStyle = (0, _utils.hexToRGBA)(fill2, opacity);
			if (stroke2 !== "none") ctx.strokeStyle = stroke2;

			ctx.beginPath();
			ctx.rect(x + w1, y, w2, height);
			ctx.closePath();
			ctx.fill();

			if (stroke2 !== "none") ctx.stroke();
		}
	});
}

exports.default = VolumeProfileSeries;
//# sourceMappingURL=VolumeProfileSeries.js.map