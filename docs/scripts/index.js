'use strict';
/**/
var React = require('react');
require('../../src/styles/main');
require('../stylesheets/re-stock.scss');

/**/

var ReadME = require('../md/MAIN.md');

document.getElementById("content").innerHTML = ReadME;

var AreaChart = require('./examples/areachart');
var LineChart = require('./examples/linechart');
var CandleStickChart = require('./examples/candlestickchart');
var AreaChartWithCrossHairMousePointer = require('./examples/areachart-with-crosshair-mousepointer');
var AreaChartWithVerticalMousePointer = require('./examples/areachart-with-mousepointer');


React.render(<AreaChart />, document.getElementById("area"));
React.render(<LineChart />, document.getElementById("line"));
React.render(<CandleStickChart />, document.getElementById("candlestick"));
// React.render(<AreaChartWithCrossHairMousePointer />, document.getElementById("content").appendChild(document.createElement("div")));
//React.render(<AreaChartWithVerticalMousePointer />, document.getElementById("content").appendChild(document.createElement("div")));

/**/


//require('./examples/freezer-example');
