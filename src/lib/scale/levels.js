export const defaultFormatters = {
	yearFormat: "%Y",
	quarterFormat: "%b %Y",
	monthFormat: "%b",
	weekFormat: "%d %b",
	dayFormat: "%a %d",
	hourFormat: "%_I %p",
	minuteFormat: "%I:%M %p",
	secondFormat: "%I:%M:%S %p",
	milliSecondFormat: "%L",
};

export const levelDefinition = [
	/* eslint-disable no-unused-vars */
	/* 19 */(d, date, i) => d.startOfYear && date.getFullYear() % 12 === 0 && "yearFormat",
	/* 18 */(d, date, i) => d.startOfYear && date.getFullYear() % 4 === 0 && "yearFormat",
	/* 17 */(d, date, i) => d.startOfYear && date.getFullYear() % 2 === 0 && "yearFormat",
	/* 16 */(d, date, i) => d.startOfYear && "yearFormat",
	/* 15 */(d, date, i) => d.startOfQuarter && "quarterFormat",
	/* 14 */(d, date, i) => d.startOfMonth && "monthFormat",
	/* 13 */(d, date, i) => d.startOfWeek && "weekFormat",
	/* 12 */(d, date, i) => d.startOfDay && i % 2 === 0 && "dayFormat",
	/* 11 */(d, date, i) => d.startOfDay && "dayFormat",
	/* 10 */(d, date, i) => d.startOfHalfDay && "hourFormat", // 12h
	/*  9 */(d, date, i) => d.startOfQuarterDay && "hourFormat", // 6h
	/*  8 */(d, date, i) => d.startOfEighthOfADay && "hourFormat", // 3h
	/*  7 */(d, date, i) => d.startOfHour && date.getHours() % 2 === 0 && "hourFormat", // 2h -- REMOVE THIS
	/*  6 */(d, date, i) => d.startOfHour && "hourFormat", // 1h
	/*  5 */(d, date, i) => d.startOf30Minutes && "minuteFormat",
	/*  4 */(d, date, i) => d.startOf15Minutes && "minuteFormat",
	/*  3 */(d, date, i) => d.startOf5Minutes && "minuteFormat",
	/*  2 */(d, date, i) => d.startOfMinute && "minuteFormat",
	/*  1 */(d, date, i) => d.startOf30Seconds && "secondFormat",
	/*  0 */(d, date, i) => "secondFormat",
	/* eslint-enable no-unused-vars */
];
