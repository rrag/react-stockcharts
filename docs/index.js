'use strict';
/**/
var React = require('react');
require('../src/styles/react-stockcharts');
require('./stylesheets/re-stock');
var d3 = require('d3');

var ReadME = require('./md/MAIN.md');

document.getElementById("content").innerHTML = ReadME;

var parseDate = d3.time.format("%Y-%m-%d").parse
d3.tsv("data/data.tsv", function(err, data) {
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});
	var AreaChart = require('./lib/areachart').init(data);
	var AreaChartWithCrossHairMousePointer = require('./lib/areachart-with-crosshair-mousepointer').init(data);
	var AreaChartWithVerticalMousePointer = require('./lib/areachart-with-mousepointer').init(data);
	var AreaChartWithToolTip = require('./lib/areachart-with-tooltip').init(data);
	var AreaChartWithMA = require('./lib/areachart-with-ma').init(data);
	var AreaChartWithEdgeCoordinates = require('./lib/areachart-with-edge-coordinates').init(data);
	var LineChart = require('./lib/linechart').init(data);
	/**/
	var CandleStickChart = require('./lib/candlestickchart').init(data);

	React.render(<AreaChart />, document.getElementById("area"));
	React.render(<AreaChartWithCrossHairMousePointer />, document.getElementById("area2"));
	React.render(<AreaChartWithVerticalMousePointer />, document.getElementById("area3"));
	React.render(<AreaChartWithToolTip />, document.getElementById("area4"));
	React.render(<AreaChartWithMA />, document.getElementById("area5"));
	React.render(<AreaChartWithEdgeCoordinates />, document.getElementById("area6"));
	React.render(<LineChart />, document.getElementById("line"));
	/**/
	React.render(<CandleStickChart />, document.getElementById("candlestick"));

	/**/
});




//require('./examples/freezer-example');
