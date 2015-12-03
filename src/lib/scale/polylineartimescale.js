"use strict";

import d3 from "d3";

function financeTimeScale(drawableData, indexAccessor, backingLinearScale, dateAccessor = d => d.date) {

	var timeScaleSteps = [
		{ step: 864e5, f: function(d) { return dateAccessor(d) !== undefined && true; }},  // 1-day
		{ step: 1728e5, f: function(d, i) { return dateAccessor(d) !== undefined && (i % 2 === 0); }}, // 2-day
		{ step: 8380e5, f: function(d, i, arr) {
				if (d.startOfMonth) return true;
				var list = [];
				if ((i - 2) >= 0) list.push(arr[i - 2]);
				if ((i - 1) >= 0) list.push(arr[i - 1]);
				list.push(arr[i]);
				if ((i + 1) <= arr.length - 1) list.push(arr[i + 1]);
				if ((i + 2) <= arr.length - 1) list.push(arr[i + 2]);
				var sm = list
							.map(function(each) { return each.startOfMonth; })
							.reduce(function(prev, curr) {
									return prev || curr;
								});
				return sm ? false : d.startOfWeek;
			}},  // 1-week
		{ step: 3525e6, f: function(d) {return d.startOfMonth; }},  // 1-month
		{ step: 7776e6, f: function(d) {return d.startOfQuarter; }},  // 3-month
		{ step: 31536e6, f: function(d) {return d.startOfYear; }},  // 1-year
		{ step: 91536e15, f: function(d) {return dateAccessor(d) !== undefined && (d.startOfYear && dateAccessor(d).getFullYear() % 2 === 0); }}  // 2-year
	];
	var timeScaleStepsBisector = d3.bisector(function(d) { return d.step; }).left;
	var bisectByIndex = d3.bisector(function(d) { return indexAccessor(d); }).left;
	var tickFormat = [
		[d3.time.format("%Y"), function(d) { return d.startOfYear; }],
		[d3.time.format("%b %Y"), function(d) { return d.startOfQuarter; }],
		[d3.time.format("%b"), function(d) { return d.startOfMonth; }],
		[d3.time.format("%d %b"), function(d) { return d.startOfWeek; }],
		[d3.time.format("%a %d "), function(d) { return true; }]
	];
	function formater(d) {
		var i = 0, format = tickFormat[i];
		while (!format[1](d)) format = tickFormat[++i];
		var tickDisplay = format[0](dateAccessor(d));
		// console.log(tickDisplay);
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
			return drawableData;
		} else {
			drawableData = x;
			// this.domain([drawableData.first().index, drawableData.last().index]);
			this.domain([indexAccessor(drawableData[0]), indexAccessor(drawableData[drawableData.length - 1])]);
			return scale;
		}
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
		var start, end, count = 0;
		drawableData.forEach(function(d) {
			if (dateAccessor(d) !== undefined) {
				if (start === undefined) start = d;
				end = d;
				count++;
			}
		});
		m = (count / drawableData.length) * m;
		var span = (dateAccessor(end).getTime() - dateAccessor(start).getTime());
		var target = span / m;
		/*
		console.log(dateAccessor(drawableData[drawableData.length - 1])
			, drawableData[0]
			, span
			, m
			, target
			, timeScaleStepsBisector(d3_time_scaleSteps, target)
			);
		*/
		var ticks = drawableData
						.filter(timeScaleSteps[timeScaleStepsBisector(timeScaleSteps, target)].f)
						.map(function(d) { return indexAccessor(d); })
						;
		// return the index of all the ticks to be displayed,
		// console.log(target, span, m, ticks);
		return ticks;
	};
	scale.tickFormat = function(ticks) {
		return function(d) {
			// for each index received from ticks() function derive the formatted output
			var tickIndex = bisectByIndex(drawableData, d);
			return formater(drawableData[tickIndex]);
		};
	};
	scale.nice = function(m) {
		backingLinearScale.nice(m);
		return scale;
	};
	scale.copy = function() {
		return financeTimeScale(drawableData, indexAccessor, backingLinearScale.copy());
	};
	return scale;
}

var defaultFinanceDateTimeScale = function(indexAccessor) {
	return financeTimeScale([0, 1], indexAccessor, d3.scale.linear());
};

module.exports = defaultFinanceDateTimeScale;
