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
	var responseData = {}
	responseData.D = data
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
	responseData.W = buildWeeklyData(responseData.D, indexMutator, dateAccesor);
	responseData.M = buildMonthlyData(responseData.D, indexMutator, dateAccesor);

	// console.table(responseData.W);

	return {
			data: responseData,
			_dateAccessor: dateAccesor,
			_indexAccessor: options.indexAccessor,
			// _indexMutator: indexMutator,
			_stockScale: true,
			_xScale: stockScale(options.indexAccessor),
			_multiInterval: true
		};
}

function buildWeeklyData(daily, indexMutator, dateAccesor) {
	var weekly = [], prevWeek, eachWeek = {};
	for (var i = 0; i < daily.length; i++) {
		var d = daily[i];

		if (!eachWeek.date) indexMutator(eachWeek,  i);

		eachWeek.date = dateAccesor(d);

		eachWeek.startOfWeek = eachWeek.startOfWeek || d.startOfWeek;
		eachWeek.startOfMonth = eachWeek.startOfMonth || d.startOfMonth;
		eachWeek.startOfQuarter = eachWeek.startOfQuarter || d.startOfQuarter;
		eachWeek.startOfYear = eachWeek.startOfYear || d.startOfYear;

		if (!eachWeek.open) eachWeek.open = d.open;
		if (!eachWeek.high) eachWeek.high = d.high;
		if (!eachWeek.low) eachWeek.low = d.low;

		eachWeek.close = d.close;

		eachWeek.high = Math.max(eachWeek.high, d.high);
		eachWeek.low = Math.min(eachWeek.low, d.low);

		if (!eachWeek.volume) eachWeek.volume = 0;
		eachWeek.volume += d.volume;

		if (d.startOfWeek) {
			if (prevWeek) {
				eachWeek.trueRange = Math.max(
					eachWeek.high - eachWeek.low
					, eachWeek.high - prevWeek.close
					, eachWeek.low - prevWeek.close
				);
			}
			prevWeek = eachWeek
			weekly.push(eachWeek);
			eachWeek = {};
		}
	}
	return weekly;
}

function buildMonthlyData(daily, indexMutator, dateAccesor) {
	var monthly = [], prevMonth, eachMonth = {};
	for (var i = 0; i < daily.length; i++) {
		var d = daily[i];

		if (!eachMonth.date) indexMutator(eachMonth,  i);

		eachMonth.date = dateAccesor(d);

		eachMonth.startOfMonth = eachMonth.startOfMonth || d.startOfMonth;
		eachMonth.startOfQuarter = eachMonth.startOfQuarter || d.startOfQuarter;
		eachMonth.startOfYear = eachMonth.startOfYear || d.startOfYear;

		if (!eachMonth.open) eachMonth.open = d.open;
		if (!eachMonth.high) eachMonth.high = d.high;
		if (!eachMonth.low) eachMonth.low = d.low;

		eachMonth.close = d.close;

		eachMonth.high = Math.max(eachMonth.high, d.high);
		eachMonth.low = Math.min(eachMonth.low, d.low);

		if (!eachMonth.volume) eachMonth.volume = 0;
		eachMonth.volume += d.volume;

		if (d.startOfMonth) {
			eachMonth.startOfWeek = d.startOfWeek;
			if (prevMonth) {
				eachMonth.trueRange = Math.max(
					eachMonth.high - eachMonth.low
					, eachMonth.high - prevMonth.close
					, eachMonth.low - prevMonth.close
				);
			}
			prevMonth = eachMonth
			monthly.push(eachMonth);
			eachMonth = {};
		}
	}
	return monthly;
}

module.exports = StockScaleTransformer;
