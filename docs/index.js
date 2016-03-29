'use strict';

import React from "react";
import ReactDOM from "react-dom";
import d3 from "d3";

import Chart from "./lib/charts/CandleStickChartWithDarkTheme";
// import Chart from "./lib/charts/OHLCChartWithElderRayIndicator";

var ReadME = require('md/MAIN.md');

require('stylesheets/re-stock');

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

	ReactDOM.render(<Chart data={data} type="hybrid"/>, document.getElementById("chart"));
});
