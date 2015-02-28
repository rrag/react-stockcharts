'use strict';
/**/
var React = require('react');

/**/

var AreaChart = require('./examples/areachart');
var LineChart = require('./examples/linechart');
var CandleStickChart = require('./examples/candlestickchart');
var AreaChartWithCrossHairMousePointer = require('./examples/areachart-with-crosshair-mousepointer');
var AreaChartWithVerticalMousePointer = require('./examples/areachart-with-mousepointer');



React.render(<AreaChart />, document.getElementById("content").appendChild(document.createElement("div")));
React.render(<LineChart />, document.getElementById("content").appendChild(document.createElement("div")));
React.render(<CandleStickChart />, document.getElementById("content").appendChild(document.createElement("div")));
React.render(<AreaChartWithCrossHairMousePointer />, document.getElementById("content").appendChild(document.createElement("div")));
React.render(<AreaChartWithVerticalMousePointer />, document.getElementById("content").appendChild(document.createElement("div")));

/**/


//require('./examples/freezer-example');
