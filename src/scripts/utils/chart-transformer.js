'use strict';

var d3 = require('d3');
var dateFormat = d3.time.format("%Y-%m-%d");

function cloneMe(obj) {
	if(obj == null || typeof(obj) !== 'object')
		return obj;
	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}
	var temp = {};//obj.constructor(); // changed

	for(var key in obj) {
		if(obj.hasOwnProperty(key)) {
			temp[key] = cloneMe(obj[key]);
		}
	}
	return temp;
}


var ChartTransformer = {
	getTransformerFor(type) {
		if (type === "none")
			return (d) => d;
		return false;
	},
	filter(data, dateAccesor, fromDate, toDate) {
		var filteredData = data.filter((each) => {
			var filtered = dateAccesor(each).getTime() > fromDate.getTime() && dateAccesor(each).getTime() < toDate.getTime()
			return filtered;
		});
		return filteredData;
	},
	populateDisplayFlags(data
			, dateAccesor
			, indexMutator) {
		var prevDate;
		var responseData = data
			//.filter((each) => Math.random() > 0.9)
			.map((each, i) => {
				var row = cloneMe(each);
				// console.log(each);
				//console.log(row);
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
				return row;
			});
		// console.table(responseData);

		return responseData;
	}
}

module.exports = ChartTransformer;
