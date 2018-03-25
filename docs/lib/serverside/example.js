

const React = require("react");
const ReactServer = require("react-dom/server");
const { timeParse } = "d3-time-format";

const parseDate = timeParse("%Y-%m-%d");

require("babel/register");

const ReStock = require("../../../src/");

// AreaChart
// AreaChartWithYPercent
// CandleStickChart
// CandleStickStockScaleChart
// CandleStickChartWithEdge
// HeikinAshi
// Kagi
// PointAndFigure
// Renko
// CandleStickChartWithEdge  - Lots of data -> data={dataFull}/>
// CandleStickChartWithCHMousePointer
// CandleStickChartWithMA
// CandleStickChartWithBollingerBandOverlay
// CandleStickStockScaleChartWithVolumeBarV1
// CandleStickStockScaleChartWithVolumeBarV2
// CandleStickStockScaleChartWithVolumeBarV3
// CandleStickChartWithZoomPan
// CandleStickChartWithCompare
// CandleStickChartWithMACDIndicator
// CandleStickChartWithRSIIndicator
// CandleStickChartWithFullStochasticsIndicator

const Chart = require("../charts/CandleStickChartWithFullStochasticsIndicator");

var fs = require("fs"),
	path = require("path"),
	readline = require("readline");

const delimiter = "\t";

var fs = require("fs"),
	readline = require("readline");

const rd = readline.createInterface({
	input: fs.createReadStream(path.join("..", "..", "data", "MSFT.tsv")),
	output: process.stdout,
	terminal: false
});

const MSFT = new Array();

let length = 0, head;
rd.on("line", function(line) {
	if (length === 0) {
		head = line.split(delimiter);
	} else {
		const item = {};
		const each = line.split(delimiter);
		head.forEach(function(key, i) {
			item[key] = each[i];
		});
		MSFT.push(item);
	}
	length++;
});

rd.on("close", function() {
	MSFT.forEach(function(d) {
		d.date = new Date(parseDate(d.date).getTime());
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		// console.log(d);
	});
	const svg = ReactServer.renderToString(React.createElement(Chart, { data: MSFT, type: "svg", width: 1000 }));

	fs.writeFileSync(path.join("output.html"), svg);
});
