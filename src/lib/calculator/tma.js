"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 TRIMA (Triangular Moving Average).

 The Triangular Moving Average can be used like any other Moving Average, to obtain a smoother representation of the underlying data.
 It is important to note that the Triangular Moving Average is typically much smoother than other moving averages.

 Triangular moving averages give greater weight to prices at the centre of the chosen period andi it is calculated as double smoothed SMA (simple moving average).

 Examples:
   For TimeSerie={a,b,c,d,e,f...} ('a' is the older price)

   1st value for TMA 4-Period is:  ((1*a)+(2*b)+(2*c)+(1*d)) / 6
   2nd value for TMA 4-Period is:  ((1*b)+(2*c)+(2*d)+(1*e)) / 6

   1st value for TMA 5-Period is:  ((1*a)+(2*b)+(3*c)+(2*d)+(1*e)) / 9
   2nd value for TMA 5-Period is:  ((1*b)+(2*c)+(3*d)+(2*e)+(1*f)) / 9

 Using algebra, it can be demonstrated that the TMA is equivalent to
 doing a SMA of a SMA. The following explain the rules:

   (1) When the period is even, TMA(x,period)=SMA(SMA(x,period/2),(period/2)+1)
   (2) When the period is odd,  TMA(x,period)=SMA(SMA(x,(period+1)/2),(period+1)/2)

 In other word:
   (1) A period of 4 becomes TMA(x,4) = SMA( SMA( x, 2), 3 )
   (2) A period of 5 becomes TMA(x,5) = SMA( SMA( x, 3), 3 )

 The SMA of a SMA is the algorithm generally found in books.
*/

exports.default = function () {
	var options = _defaultOptionsForComputation.TMA;

	function calculator(data) {
		var _options = options,
		    windowSize = _options.windowSize,
		    sourcePath = _options.sourcePath;


		var n = Math.floor(windowSize / 2);
		var weight = windowSize % 2 === 0 ? n * (n + 1) : (n + 1) * (n + 1);

		var triaverage = (0, _utils.slidingWindow)().windowSize(windowSize).sourcePath(sourcePath).accumulator(function (values) {
			var total = (0, _d3Array.sum)(values, function (v, i) {
				return i < n ? (i + 1) * v : (windowSize - i) * v;
			});
			return total / weight;
		});

		return triaverage(data);
	}
	calculator.undefinedLength = function () {
		var _options2 = options,
		    windowSize = _options2.windowSize;

		return windowSize - 1;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = _extends({}, _defaultOptionsForComputation.TMA, x);
		return calculator;
	};

	return calculator;
};

var _d3Array = require("d3-array");

var _utils = require("../utils");

var _defaultOptionsForComputation = require("./defaultOptionsForComputation");
//# sourceMappingURL=tma.js.map