'use strict';

var React = require('react');

var AreaChart = require('./examples/areachart');
var LineChart = require('./examples/linechart');
var CandleStickChart = require('./examples/candlestickchart');

React.render(<AreaChart />, document.getElementById("area"));
React.render(<LineChart />, document.getElementById("line"));
React.render(<CandleStickChart />, document.getElementById("candlestick"));
