'use strict';

var d3 = require('d3');
var dateFormat = d3.time.format("%Y-%m-%d");

var ChartTransformer = {
	getTransformerFor(type) {
		if (type === "none")
			return (d) => d;
		return false;
	},
	populateDisplayFlags(data
			, dateAccesor
			, indexMutator) {
		var prevDate;
		data.forEach((row, i) => {
			indexMutator(row,  i);

			row.startOfWeek = false;
			row.startOfMonth = false;
			row.startOfQuarter = false;
			row.startOfYear = false;
			var date = dateAccesor(row);
			row.displayDate = dateFormat(date);
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
		})
		//console.table(data);

		return data;
	}
}

module.exports = ChartTransformer;