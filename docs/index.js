'use strict';
/**/
var React = require('react');
var d3 = require('d3');

require('../src/styles/react-stockcharts');
require('stylesheets/re-stock');

var ReadME = require('md/MAIN.md');

document.getElementById("content").innerHTML = ReadME;

var parseDate = d3.time.format("%Y-%m-%d").parse
d3.tsv("data/MSFT.tsv", function(err, data) {
	data.forEach((d, i) => {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});

	var Chart = require('lib/charts/CandleStickChartWithMACDIndicator');

	React.render(<Chart data={data} />, document.getElementById("chart"));
});

//require('./examples/freezer-example');
