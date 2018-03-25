import { tsvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

import React from "react";
import ReactDOM from "react-dom";

import Chart from "./lib/charts/CandleStickChartWithDarkTheme";
// import Chart from "./lib/charts/OHLCChartWithElderRayIndicator";

const ReadME = require("md/MAIN.md");

require("stylesheets/re-stock");

document.getElementById("content").innerHTML = ReadME;

const parseDate = timeParse("%Y-%m-%d");

if (!window.Modernizr.fetch || !window.Modernizr.promises) {
	require.ensure(["whatwg-fetch", "es6-promise"], function(require) {
		require("es6-promise");
		require("whatwg-fetch");
		loadPage();
	});
} else {
	loadPage();
}

function loadPage() {
	fetch("data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, d => {
			d.date = new Date(parseDate(d.date).getTime());
			d.open = +d.open;
			d.high = +d.high;
			d.low = +d.low;
			d.close = +d.close;
			d.volume = +d.volume;

			return d;
		}))
		.then(data => {
			ReactDOM.render(<Chart data={data} type="hybrid"/>, document.getElementById("chart"));
		});
}
