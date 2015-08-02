"use strict";

// common components
exports.ChartCanvas = require("./lib/ChartCanvas");
exports.DataTransform = require("./lib/DataTransform");

// exports.XAxis = require("./lib/XAxis");
// exports.YAxis = require("./lib/YAxis");
exports.Chart = require("./lib/Chart");
exports.DataSeries = require("./lib/DataSeries");

exports.axes = {
	XAxis: require("./lib/axes").XAxis,
	YAxis: require("./lib/axes").YAxis
}

// chart types & Series
exports.AreaSeries = require("./lib/AreaSeries");
exports.LineSeries = require("./lib/LineSeries");
exports.CompareSeries = require("./lib/CompareSeries");
exports.CandlestickSeries = require("./lib/CandleStickSeries");
exports.OverlaySeries = require("./lib/OverlaySeries");
exports.HistogramSeries = require("./lib/HistogramSeries");
exports.KagiSeries = require("./lib/KagiSeries");
exports.PointAndFigureSeries = require("./lib/PointAndFigureSeries");
exports.RenkoSeries = require("./lib/RenkoSeries");
exports.MACDSeries = require("./lib/MACDSeries");

// interaction components
exports.EventCapture = require("./lib/EventCapture");
exports.MouseCoordinates = require("./lib/MouseCoordinates");
exports.CrossHair = require("./lib/CrossHair");
exports.VerticalMousePointer = require("./lib/VerticalMousePointer");
exports.CurrentCoordinate = require("./lib/CurrentCoordinate");

// misc
exports.EdgeContainer = require("./lib/EdgeContainer");
exports.EdgeIndicator = require("./lib/EdgeIndicator");

exports.helper = {
	ChartWidthMixin: require("./lib/helper/ChartWidthMixin")
};

exports.indicator = {
	MACD: require("./lib/indicators/MACDIndicator")
};

// Tooltips
exports.tooltip = {
	MACDTooltip: require("./lib/MACDTooltip"),
	TooltipContainer: require("./lib/TooltipContainer"),
	OHLCTooltip: require("./lib/OHLCTooltip"),
	CompareTooltip: require("./lib/CompareTooltip"),
	MovingAverageTooltip: require("./lib/MovingAverageTooltip"),
};

/*exports.TooltipContainer = require("./lib/TooltipContainer");
exports.OHLCTooltip = require("./lib/OHLCTooltip");
exports.CompareTooltip = require("./lib/CompareTooltip");
exports.MovingAverageTooltip = require("./lib/MovingAverageTooltip");
*/
exports.version = "0.2.0-alpha-1"