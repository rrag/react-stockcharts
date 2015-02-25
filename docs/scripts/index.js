'use strict';
/**/
var React = require('react');

/*
var AreaChart = require('./examples/areachart');
var LineChart = require('./examples/linechart');
var CandleStickChart = require('./examples/candlestickchart');
*/
var AreaChartWithMousePointer = require('./examples/areachart-with-mousepointer');

React.render(<AreaChartWithMousePointer />, document.getElementById("area-mousepointer"));
/*
React.render(<AreaChart />, document.getElementById("area"));
React.render(<LineChart />, document.getElementById("line"));
React.render(<CandleStickChart />, document.getElementById("candlestick"));
*/


//require('./examples/freezer-example');
