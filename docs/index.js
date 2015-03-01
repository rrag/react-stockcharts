'use strict';
/**/
var React = require('react');
require('../src/styles/react-stockcharts');
require('./stylesheets/re-stock');

var ReadME = require('./md/MAIN.md');

document.getElementById("content").innerHTML = ReadME;

var AreaChart = require('./lib/areachart');
var LineChart = require('./lib/linechart');
var CandleStickChart = require('./lib/candlestickchart');
var AreaChartWithCrossHairMousePointer = require('./lib/areachart-with-crosshair-mousepointer');
var AreaChartWithVerticalMousePointer = require('./lib/areachart-with-mousepointer');


React.render(<AreaChart />, document.getElementById("area"));
React.render(<LineChart />, document.getElementById("line"));
React.render(<CandleStickChart />, document.getElementById("candlestick"));
// React.render(<AreaChartWithCrossHairMousePointer />, document.getElementById("content").appendChild(document.createElement("div")));
//React.render(<AreaChartWithVerticalMousePointer />, document.getElementById("content").appendChild(document.createElement("div")));

/**/


//require('./examples/freezer-example');
