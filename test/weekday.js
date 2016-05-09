var d3 = require("d3");

function skipWeekends() {
	// Returns the weekday number for the given date relative to January 1, 1970.
	function weekday(date) {
		var weekdays = weekdayOfYear(date),
				year = date.getFullYear();
		while (--year >= 1970) weekdays += weekdaysInYear(year);
		return weekdays;
	}

	// Returns the date for the specified weekday number relative to January 1, 1970.
	weekday.invert = function(weekdays) {
		var year = 1970,
				yearWeekdays;

		// Compute the year.
		while ((yearWeekdays = weekdaysInYear(year)) <= weekdays) {
			++year;
			weekdays -= yearWeekdays;
		}

		// Compute the date from the remaining weekdays.
		var days = weekdays % 5,
				day0 = ((new Date(year, 0, 1)).getDay() + 6) % 7;

		if (day0 === 6) days -= 1;
		if (day0 + days > 4) days += 2;
		return new Date(year, 0, (weekdays / 5 | 0) * 7 + days + 1);
	};

	// Returns the number of weekdays in the specified year.
	function weekdaysInYear(year) {
		return weekdayOfYear(new Date(year, 11, 31)) + 1;
	}

	// Returns the weekday number for the given date relative to the start of the year.
	function weekdayOfYear(date) {
		var days = d3.time.dayOfYear(date),
				weeks = days / 7 | 0,
				day0 = (d3.time.year(date).getDay() + 6) % 7,
				day1 = day0 + days - weeks * 7;
		return Math.max(0, days - weeks * 2
				- (day0 <= 5 && day1 >= 5 || day0 <= 12 && day1 >= 12) // extra saturday
				- (day0 <= 6 && day1 >= 6 || day0 <= 13 && day1 >= 13)); // extra sunday
	}
	return weekday;
};

var weekday = skipWeekends();

// console.log(d3.range(20000).every(d => d === weekday(weekday.invert(d))));
console.log(weekday.invert(20000));


