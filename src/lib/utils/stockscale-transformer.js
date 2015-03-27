'use strict';

var d3 = require('d3');
var dateFormat = d3.time.format("%Y-%m-%d");
var Utils = require('./utils');
var stockScale = require('../scale/polylineartimescale');

var defaultOptions = {
	dateAccesor: (d) => d.date,
	indexAccessor: (d) => d._idx,
	indexMutator: (d, i) => {d._idx = i;}
}

function StockScaleTransformer(data, options) {
	if (options === undefined) options = defaultOptions;
	var dateAccesor = options.dateAccesor;
	var indexMutator = options.indexMutator;

	var prevDate;
	var responseData = data
		//.filter((each) => Math.random() > 0.9)
		.map((each, i) => {
			var row = each;//Utils.cloneMe(each);
			// console.log(each);
			//console.log(row);
			indexMutator(row,  i);

			row.startOfWeek = false;
			row.startOfMonth = false;
			row.startOfQuarter = false;
			row.startOfYear = false;
			var date = dateAccesor(row);
			//row.displayDate = dateFormat(date);
			if (prevDate !== undefined) {
				// According to ISO calendar
				// Sunday = 0, Monday = 1, ... Saturday = 6
				// day of week of today < day of week of yesterday then today is start of week
				row.startOfWeek = date.getDay() < prevDate.getDay();
				// month of today != month of yesterday then today is start of month
				row.startOfMonth = date.getMonth() != prevDate.getMonth();
				//if start of month and month % 3 === 0 then it is start of quarter
				row.startOfQuarter = row.startOfMonth && date.getMonth() % 3 === 0;
				// year of today != year of yesterday then today is start of year
				row.startOfYear = date.getYear() != prevDate.getYear();
			}
			prevDate = date;
			return row;
		});
	// console.table(responseData);
	return {
			data: responseData,
			_dateAccessor: dateAccesor,
			_indexAccessor: options.indexAccessor,
			// _indexMutator: indexMutator,
			_stockScale: true,
			_xScale: stockScale(options.indexAccessor)
		};
}

module.exports = StockScaleTransformer;
