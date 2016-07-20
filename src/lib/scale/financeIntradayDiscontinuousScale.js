"use strict";

import d3 from "d3";

import { isDefined, isNotDefined, head, last } from "../utils";

export default function financeIntradayScale(indexAccessor = d => d.idx, dateAccessor = d => d.date, data = [0, 1], backingLinearScale = d3.scale.linear()) {

	var timeScaleSteps = [
		{ step: 40000, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || d.startOfMinute); } }, // 1 min
		{ step: 192000, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || d.startOf5Minutes); } }, // 5 min
		{ step: 400000, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || d.startOfQuarterHour); } },
		{ step: 6684000, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || d.startOfHalfHour); } },
		{ step: 108e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || d.startOfHour); } },
		{ step: 216e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || d.startOfEighthDay); } },
		{ step: 432e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || d.startOfQuarterDay); } }, // 12 hours
		{ step: 864e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || d.startOfHalfDay); } },  // 1-day
		{ step: 2592e5, f: function(d) { return isDefined(dateAccessor(d)) && d.startOfDay; } },  // 3-day, doesnt work with 2h scale
		{ step: 6048e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay && dateAccessor(d).getDate() % 3 === 0); } },  // 7-day
		{ step: 12096e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay && dateAccessor(d).getDate() % 3 === 0); } }  // 14-day
	];
	var timeScaleStepsBisector = d3.bisector(function(d) { return d.step; }).left;
	var bisectByIndex = d3.bisector(function(d) { return indexAccessor(d); }).left;
	var tickFormat = [
		[d3.time.format.utc("%a %d"), function(d) { return d.startOfDay; }],
		[d3.time.format.utc("%_I %p"), function(d) { return d.startOfHour && !d.startOfDay; }],
		[d3.time.format.utc("%I:%M %p"), d3.functor(true)] // accumulator fallback for first entry
	];
	function formater(d) {
		var i = 0, format = tickFormat[i];
		while (!format[1](d)) format = tickFormat[++i];
		var tickDisplay = format[0](dateAccessor(d));
		// console.log(t;ickDisplay);
		return tickDisplay;
	}

	function scale(x) {
		return backingLinearScale(x);
	}
	scale.isPolyLinear = function() {
		return true;
	};
	scale.invert = function(x) {
		return backingLinearScale.invert(x);
	};
	scale.data = function(x) {
		if (!arguments.length) {
			return data;
		} else {
			data = x;
			// this.domain([data.first().index, data.last().index]);
			this.domain([indexAccessor(data[0]), indexAccessor(data[data.length - 1])]);
			return scale;
		}
	};
	scale.indexAccessor = function(x) {
		if (!arguments.length) return indexAccessor;
		indexAccessor = x;
		return scale;
	};
	scale.dateAccessor = function(x) {
		if (!arguments.length) return dateAccessor;
		dateAccessor = x;
		return scale;
	};
	scale.domain = function(x) {
		if (!arguments.length) return backingLinearScale.domain();
		// console.log("before = %s, after = %s", JSON.stringify(backingLinearScale.domain()), JSON.stringify(x))

		var d = [x[0], x[1]];
		// console.log(d);
		backingLinearScale.domain(d);
		return scale;
	};
	scale.range = function(x) {
		if (!arguments.length) return backingLinearScale.range();
		backingLinearScale.range(x);
		return scale;
	};
	scale.rangeRound = function(x) {
		return backingLinearScale.range(x);
	};
	scale.clamp = function(x) {
		if (!arguments.length) return backingLinearScale.clamp();
		backingLinearScale.clamp(x);
		return scale;
	};
	scale.interpolate = function(x) {
		if (!arguments.length) return backingLinearScale.interpolate();
		backingLinearScale.interpolate(x);
		return scale;
	};
	scale.ticks = function(m) {
		/* var start, end, count = 0;
		data.forEach(function(d) {
			if (isDefined(dateAccessor(d))) {
				if (isNotDefined(start)) start = d;
				end = d;
				count++;
			}
		});
		console.log(count / data.length);
		m = (count / data.length) * m;
		*/

		var start = head(data);
		var end = last(data);
		var [startIndex, endIndex] = backingLinearScale.domain();
		var newM = ((indexAccessor(end) - indexAccessor(start)) / (endIndex - startIndex)) * m;
		// newM >
		// m = (end - start) * m

		/* var levels;
		var levelsCount;
		var levelsCount.filter(each => each > newM * .5 && each < newM * 1.5)*/

		var span = (dateAccessor(end).getTime() - dateAccessor(start).getTime());
		var target = Math.round(span / newM);
		// console.log(newM, m, span, target, dateAccessor(end), dateAccessor(start))

		/* console.log(dateAccessor(data[data.length - 1])
			, data[0]
			, span
			, m
			, target
			, timeScaleStepsBisector(timeScaleSteps, target)
			, count
			, data.length);*/

		var scaleIndex = timeScaleStepsBisector(timeScaleSteps, target);

		var ticks = data
						.filter(timeScaleSteps[scaleIndex].f)
						// .map(d => { console.log(d); return d })
						.map(indexAccessor)
						;
		// return the index of all the ticks to be displayed,
		// console.log(target, span, m, ticks);
		// console.log(ticks);
		return ticks;
	};
	scale.tickFormat = function(/* ticks */) {
		return function(d) {
			// for each index received from ticks() function derive the formatted output
			var tickIndex = bisectByIndex(data, d);
			return formater(data[tickIndex]);
		};
	};
	scale.nice = function(m) {
		backingLinearScale.nice(m);
		return scale;
	};
	scale.copy = function() {
		return financeIntradayScale(indexAccessor, dateAccessor, data, backingLinearScale.copy());
	};
	return scale;
}