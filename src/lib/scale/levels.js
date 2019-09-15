"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var defaultFormatters = exports.defaultFormatters = {
	yearFormat: "%Y",
	quarterFormat: "%b %Y",
	monthFormat: "%b",
	weekFormat: "%d %b",
	dayFormat: "%a %d",
	hourFormat: "%_I %p",
	minuteFormat: "%I:%M %p",
	secondFormat: "%I:%M:%S %p",
	milliSecondFormat: "%L"
};

var levelDefinition = exports.levelDefinition = [
/* eslint-disable no-unused-vars */
/* 19 */function (d, date, i) {
	return d.startOfYear && date.getFullYear() % 12 === 0 && "yearFormat";
},
/* 18 */function (d, date, i) {
	return d.startOfYear && date.getFullYear() % 4 === 0 && "yearFormat";
},
/* 17 */function (d, date, i) {
	return d.startOfYear && date.getFullYear() % 2 === 0 && "yearFormat";
},
/* 16 */function (d, date, i) {
	return d.startOfYear && "yearFormat";
},
/* 15 */function (d, date, i) {
	return d.startOfQuarter && "quarterFormat";
},
/* 14 */function (d, date, i) {
	return d.startOfMonth && "monthFormat";
},
/* 13 */function (d, date, i) {
	return d.startOfWeek && "weekFormat";
},
/* 12 */function (d, date, i) {
	return d.startOfDay && i % 2 === 0 && "dayFormat";
},
/* 11 */function (d, date, i) {
	return d.startOfDay && "dayFormat";
},
/* 10 */function (d, date, i) {
	return d.startOfHalfDay && "hourFormat";
}, // 12h
/*  9 */function (d, date, i) {
	return d.startOfQuarterDay && "hourFormat";
}, // 6h
/*  8 */function (d, date, i) {
	return d.startOfEighthOfADay && "hourFormat";
}, // 3h
/*  7 */function (d, date, i) {
	return d.startOfHour && date.getHours() % 2 === 0 && "hourFormat";
}, // 2h -- REMOVE THIS
/*  6 */function (d, date, i) {
	return d.startOfHour && "hourFormat";
}, // 1h
/*  5 */function (d, date, i) {
	return d.startOf30Minutes && "minuteFormat";
},
/*  4 */function (d, date, i) {
	return d.startOf15Minutes && "minuteFormat";
},
/*  3 */function (d, date, i) {
	return d.startOf5Minutes && "minuteFormat";
},
/*  2 */function (d, date, i) {
	return d.startOfMinute && "minuteFormat";
},
/*  1 */function (d, date, i) {
	return d.startOf30Seconds && "secondFormat";
},
/*  0 */function (d, date, i) {
	return "secondFormat";
}];
//# sourceMappingURL=levels.js.map