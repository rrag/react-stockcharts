'use strict';
/**/
var React = require('react');
var d3 = require('d3');

require('styles/react-stockcharts');
require('stylesheets/re-stock');

var ReadME = require('md/MAIN.md');

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
	/**/
	var AreaChart = require('./lib/examples/areachart').init(data);
	var AreaChartWithCrossHairMousePointer = require('./lib/examples/areachart-with-crosshair-mousepointer').init(data);
	var AreaChartWithVerticalMousePointer = require('./lib/examples/areachart-with-mousepointer').init(data);
	var AreaChartWithToolTip = require('./lib/examples/areachart-with-tooltip').init(data);
	var AreaChartWithMA = require('./lib/examples/areachart-with-ma').init(data);
	var AreaChartWithEdgeCoordinates = require('./lib/examples/areachart-with-edge-coordinates').init(data);
	var LineChart = require('./lib/examples/linechart').init(data);
	var CandleStickChart = require('./lib/examples/candlestickchart').init(data);
	var SyncMouseMove = require('./lib/examples/synchronized-mouse-move').init(data);
	var AreaChartWithZoom = require('./lib/examples/areachart-with-zoom').init(data);
	var AreaChartWithZoomPan = require('./lib/examples/areachart-with-zoom-and-pan').init(data);
	/**/

	/**/
	React.render(<AreaChart />, document.getElementById("area"));
	React.render(<AreaChartWithCrossHairMousePointer />, document.getElementById("area2"));
	React.render(<AreaChartWithVerticalMousePointer />, document.getElementById("area3"));
	React.render(<AreaChartWithToolTip />, document.getElementById("area4"));
	React.render(<AreaChartWithMA />, document.getElementById("area5"));
	React.render(<AreaChartWithEdgeCoordinates />, document.getElementById("area6"));
	React.render(<LineChart />, document.getElementById("line"));
	React.render(<CandleStickChart />, document.getElementById("candlestick"));
	React.render(<SyncMouseMove />, document.getElementById("sync"));
	React.render(<AreaChartWithZoom />, document.getElementById("areazoom"));
	React.render(<AreaChartWithZoomPan />, document.getElementById("areazoompan"));
	/**/
	/**/
});

//require('./examples/freezer-example');
