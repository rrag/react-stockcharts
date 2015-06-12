'use strict';

var path = require('path')
	, fs = require('fs')
	, liner = require("./liner");

var ticker = 'SP500';

var sourceFile = path.join(__dirname, '..', 'data', ticker + '.csv');
var targetFile = path.join(__dirname, '..', 'data', ticker + '_full.tsv');

var splitHistoryFile = path.join(__dirname, '..', 'data', ticker + '-splithistory.json');

createSplitHistory(splitHistoryFile, process);

function process(splitHistory) {
	var i, multiplier = 1;
	for (i = splitHistory.length - 1; i >= 0; i--) {
		multiplier = splitHistory[i].multiplier * multiplier;
		splitHistory[i].multiplier = multiplier;
		// console.log(splitHistory[i]);
	}

	// sort decending
	splitHistory.sort(function(a, b) {
		return b.date.getTime() - a.date.getTime();
	});

	var source = fs.createReadStream(sourceFile);
	var target = fs.createWriteStream(targetFile);

	source.pipe(liner);

	var count = 0, head, thisMultiplier = 1, data = [];
	liner.on('readable', function() {
		var line, eachLine;
		while (line = liner.read()) {
			// do something with line
			// console.log(line.toLowerCase());
			if (count > 0) {
				eachLine = lineToJson(line, head);

				thisMultiplier = 1;
				splitHistory.forEach(function (eachSplit) {
					if (eachLine.dateObj < eachSplit.date) {
						thisMultiplier = eachSplit.multiplier
					}
				})
				// console.log(eachLine.dateObj, thisMultiplier);
				eachLine.adjustedOpen = eachLine.open / thisMultiplier;
				eachLine.adjustedHigh = eachLine.high / thisMultiplier;
				eachLine.adjustedLow = eachLine.low / thisMultiplier;
				eachLine.adjustedClose = eachLine.close / thisMultiplier;
				eachLine.adjustedVolume = eachLine.volume; // * thisMultiplier;
				data.push(eachLine);
			} else {
				head = line.toLowerCase().split(',');
			}
			count++;
		}
		// console.log('lines = ', count);
	});

	liner.on('end', function() {
		console.log('end ', count, splitHistory);
		var newHead = head.reduce(function (a, b) {
			return a + '\t' + b;
		});
		target.write(newHead + '\n');
		var lines = data.map(function (each) {
			var line = Object.keys(each).filter(function(key) {
				return ['adjustedOpen', 'adjustedHigh', 'adjustedLow', 'adjustedClose', 'adjustedVolume'].indexOf(key) > -1
			})
			.map(function(key) {
				return Math.round(each[key] * 100) / 100;
			})
			.reduce(function (a, b) {
				return a + '\t' + b;
			})
			return each.date + '\t' + line;
		})
		while (lines.length > 0) {
			target.write(lines.pop() + '\n');
		}
		target.end();
	});
}


function lineToJson(line, head) {
	var obj = {}, columns = line.split(',');
	head.forEach(function (key, i) {
		if (key === 'date')
			obj.dateObj = new Date(columns[i]);
		obj[key] = columns[i];
	})
	return obj;
}

function createSplitHistory(stockSplitHistoryFile, cb) {
	fs.readFile(stockSplitHistoryFile, 'utf8', function (err, history) {
		if (err) cb([]);
		else {
			var splitHistory = JSON.parse(history);
			var modified = splitHistory.map(function (each) {
				each.date = new Date(each.date);
				return each;
			});
			cb(modified);
		}
	})
}