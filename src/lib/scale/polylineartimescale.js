'use strict';

var d3 = require('d3');

var polylineartimescale = function(indexAccessor) {
	return guided_scale([0, 1], indexAccessor, d3.scale.linear());
};

function guided_scale(drawableData, indexAccessor, backingLinearScale) {
	//var  = 'week'; //valid values 'day', 'week', 'month'

	var d3_time_scaleSteps = [
		{ step: 864e5, f: function (d, i) {return d.date !== undefined && true ;}},  // 1-day
		{ step: 1728e5, f: function (d, i) {return d.date !== undefined && (i % 2 == 0) ;}},  // 2-day
		{ step: 8380e5, f: function (d, i, arr) {
				if (d.startOfMonth) return true;
				var list = [];
				if ((i - 2) >= 0) list.push(arr[i - 2]);
				if ((i - 1) >= 0) list.push(arr[i - 1]);
				list.push(arr[i]);
				if ((i + 1) <= arr.length - 1) list.push(arr[i + 1]);
				if ((i + 2) <= arr.length - 1) list.push(arr[i + 2]);
				var sm = list
							.map(function (d) { return d.startOfMonth; })
							.reduce(function(prev, curr) {
									return prev || curr;
								});
				return sm ? false : d.startOfWeek;
			}},  // 1-week
		{ step: 3525e6, f: function (d) {return d.startOfMonth; }},  // 1-month
		{ step: 7776e6, f: function (d) {return d.startOfQuarter; }},  // 3-month
		{ step: 31536e6, f: function (d) {return d.startOfYear; }},  // 1-year
		{ step: 91536e15, f: function (d) {return d.date !== undefined && (d.startOfYear && d.date.getFullYear() % 2 == 0); }}  // 2-year
	];
	var timeScaleStepsBisector = d3.bisector(function(d) { return d.step; }).left;
	var __BISECT = d3.bisector(function(d) { return indexAccessor(d); }).left;
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
		var tickDisplay = format[0](d.date);
		// console.log(tickDisplay);
		return tickDisplay;
	};

	var ticks;

	function scale(x) {
		return backingLinearScale(x);
	};
	scale.isPolyLinear = function() {
		return true;
	}
	scale.invert = function(x) {
		return backingLinearScale.invert(x);
	};
	scale.data = function(x) {
		if (!arguments.length) {
			return drawableData;
		} else {
			drawableData = x;
			//this.domain([drawableData.first().index, drawableData.last().index]);
			this.domain([indexAccessor(drawableData[0]), indexAccessor(drawableData[drawableData.length - 1])]);
			return scale;
		}
	};
	scale.domain = function(x) {
		if (!arguments.length) return backingLinearScale.domain();
		//console.log("before = %s, after = %s", JSON.stringify(backingLinearScale.domain()), JSON.stringify(x))
		//var d = [Math.floor(x[0]), Math.ceil(x[1])]
		var d = [x[0], x[1]]
		//console.log(d);
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
		drawableData.forEach(function (d, i) {
			if (d.date !== undefined) {
				if (start === undefined) start = d;
				end = d;
				count++;
			}
		});
		m = (count/drawableData.length) * m;
		var span = (end.date.getTime() - start.date.getTime());
		var target = span/m;
		/*
		console.log(drawableData[drawableData.length - 1].date
			, drawableData[0].date
			, span
			, m
			, target
			, timeScaleStepsBisector(d3_time_scaleSteps, target)
			);
		*/
		var ticks = drawableData
						.filter(d3_time_scaleSteps[timeScaleStepsBisector(d3_time_scaleSteps, target)].f)
						.map(function(d, i) {return indexAccessor(d);})
						;
		// return the index of all the ticks to be displayed,
		//console.log(target, span, m, ticks);
		return ticks;
	};
	scale.tickFormat = function(ticks) {
		return function(d) {
			// for each index received from ticks() function derive the formatted output
			var tickIndex = __BISECT(drawableData, d);
			return formater(drawableData[tickIndex]) ;
			//return formater(d) ;
		};
	}

	scale.nice = function(m) {
		backingLinearScale.nice(m);
		return scale;
	};
	scale.copy = function() {
		return guided_scale(drawableData, indexAccessor, backingLinearScale.copy());
	};
	return scale;
}


module.exports = polylineartimescale