"use strict";

var React = require("react");
var ReactServer = require("react-dom/server");
var d3 = require("d3");
var parseDate = d3.time.format("%Y-%m-%d").parse

require("babel/register");

var ReStock = require("../../../src/");

// AreaChart
// AreaChartWithYPercent
// CandleStickChart
// CandleStickStockScaleChart
// CandleStickChartWithEdge
// HaikinAshi
// Kagi
// PointAndFigure
// Renko
// CandleStickChartWithEdge  - Lots of data -> data={dataFull}/>
// CandleStickChartWithCHMousePointer
// CandleStickChartWithMA
// CandleStickChartWithBollingerBandOverlay
// CandleStickStockScaleChartWithVolumeBarV1
// CandleStickStockScaleChartWithVolumeBarV2
// CandleStickStockScaleChartWithVolumeBarV3
// CandleStickChartWithZoomPan
// CandleStickChartWithCompare
// CandleStickChartWithMACDIndicator
// CandleStickChartWithRSIIndicator
// CandleStickChartWithFullStochasticsIndicator

var Chart = require("../charts/CandleStickChartWithFullStochasticsIndicator");

var fs = require("fs"),
	path = require("path"),
	readline = require("readline");

var delimiter = "\t";

var fs = require("fs"),
	readline = require("readline");

var rd = readline.createInterface({
	input: fs.createReadStream(path.join("..", "..", "data", "MSFT.tsv")),
	output: process.stdout,
	terminal: false
});

var MSFT = new Array();

var length = 0, head;
rd.on("line", function(line) {
	if (length === 0) {
		head = line.split(delimiter);
	} else {
		var item = {};
		var each = line.split(delimiter);
		head.forEach(function(key, i) {
			item[key] = each[i];
		})
		MSFT.push(item);
	}
	length++;
});

rd.on("close", function() {
	MSFT.forEach(function(d) {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});
	var svg = ReactServer.renderToString(React.createElement(Chart, { data: MSFT, type: "svg", width: 1000 }));

	fs.writeFileSync(path.join("output.html"), svg);
})
