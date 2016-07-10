// http://getsplithistory.com/GE

var request = require("request");
var path = require("path");
var fs = require("fs");

var jsdom = require("jsdom");
var d3 = require("d3");

var async = require('asyncawait/async');
var await = require('asyncawait/await');

var ticker = "YHOO"

function parseOHLC(str) {
	var cols = str.split(",");
	var date = new Date(cols[0]);
	var open = +cols[1];
	var high = +cols[2];
	var low = +cols[3];
	var close = +cols[4];
	var volume = +cols[5];

	return { date, open, high, low, close, volume };
}

function getRows(ticker, startYear, endYear) {
	var startMonth = 0;
	var startDate = 1;
	// var startYear = endYear - 20;

	var endMonth = 11;
	var endDate = 31;

	var url = `http://real-chart.finance.yahoo.com/table.csv?s=${ticker}&d=${endMonth}&e=${endDate}&f=${endYear}&g=d&a=${startMonth}&b=${startDate}&c=${startYear}&ignore=.csv`
	var promise = new Promise((resolve, reject) => {
		request(url, function (err, response, body) {
			if (err) {
				reject(err);
			} else if (response.statusCode == 200) {
				var rows = body.split('\n').slice(1).reverse().slice(1);
				var ohlc = rows.map(parseOHLC)
				// console.log(ohlc)
				resolve(ohlc);
			} else {
				resolve([]);
			}
		})
	});
	return promise;
}


function getHistoricalData(ticker, endYear = new Date().getFullYear()) {

	var proceed = true
	var allRows = [];
	var delta = 5

	while(proceed) {
		var rows = await (getRows(ticker, endYear - delta, endYear));
		proceed = rows.length > 0

		allRows = rows.concat(allRows);

		endYear = endYear - delta - 1
	}

	return allRows
}

// http://real-chart.finance.yahoo.com/table.csv?s=YHOO&d=${endMonth}&e=${endDate}&f=${endYear}&g=d&a=${startMonth}&b=${startDate}&c=${startYear}&ignore=.csv
// http://www.google.com/finance/historical?output=csv&q=MSFT

function handleSplits(ticker) {
	return function (rows) {
		var promise = new Promise((resolve, reject) => {
			jsdom.env({
				url: `http://getsplithistory.com/${ticker}`,
				scripts: ["http://code.jquery.com/jquery.js"],
				done: function (err, window) {
					var $ = window.$;
					var splitHistory = $.map($("table#table-splits tbody tr:not(:last)"), function(each) {
						var tr = $(each);
						var date = new Date(tr.children("td:first").text());
						var ratio = tr.children("td:nth-child(2)").text().split(":");
						var factor = (+ratio[0]) / (+ratio[1]);
						return { date, ratio, factor }
					}).reverse();

					// console.log(splitHistory);

					for (var i = 0; i < splitHistory.length; i++) {
						var each = splitHistory[i];
						for (var j = 0; j < rows.length; j++) {
							var row = rows[j];
							// console.log(row.date < each.date)
							if (row.date < each.date) {

								row.open = row.open / each.factor;
								row.high = row.high / each.factor;
								row.low = row.low / each.factor;
								row.close = row.close / each.factor;
							} else {
								break;
							}
						}
					}
					resolve(rows);
				}
			});
		})
		return promise;
	}

}

function parseDataToTSV(data) {
	var head = "date\topen\thigh\tlow\tclose\tvolume";
	var body = data
		.map(d => {
			// var date = `${d.date.getFullYear()}-${d.date.getMonth() + 1}-${d.date.getDate()}`
			return `${dateFormat(d.date)}	${d.open}	${d.high}	${d.low}	${d.close}	${d.volume}`
		})
		.reduce((a, b) => a + "\n" + b);
	return head + "\n" + body;
}

function writeToFile(data) {
	var target = path.join(__dirname, `${ticker}_full.csv`);
	console.log(target);
	fs.writeFileSync(target, data, 'utf8');
}

var download = async (getHistoricalData)

var dateFormat = d3.time.format("%Y-%m-%d")

download(ticker)
	.then(handleSplits(ticker))
	.then(parseDataToTSV)
	.then(writeToFile)