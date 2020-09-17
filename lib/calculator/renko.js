"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
	var options = _defaultOptionsForComputation.Renko;

	var dateAccessor = function dateAccessor(d) {
		return d.date;
	};
	var dateMutator = function dateMutator(d, date) {
		d.date = date;
	};

	function calculator(rawData) {
		var _options = options,
		    reversalType = _options.reversalType,
		    fixedBrickSize = _options.fixedBrickSize,
		    sourcePath = _options.sourcePath,
		    windowSize = _options.windowSize;


		var source = sourcePath === "high/low" ? function (d) {
			return { high: d.high, low: d.low };
		} : function (d) {
			return { high: d.close, low: d.close };
		};

		var pricingMethod = source;
		var brickSize = void 0;

		if (reversalType === "ATR") {
			// calculateATR(rawData, period);
			var atrAlgorithm = (0, _atr2.default)().options({ windowSize: windowSize });

			var atrCalculator = (0, _utils.merge)().algorithm(atrAlgorithm).merge(function (d, c) {
				d["atr" + windowSize] = c;
			});

			atrCalculator(rawData);
			brickSize = function brickSize(d) {
				return d["atr" + windowSize];
			};
		} else {
			brickSize = (0, _utils.functor)(fixedBrickSize);
		}

		var renkoData = [];

		var index = 0,
		    prevBrickClose = rawData[index].open,
		    prevBrickOpen = rawData[index].open;
		var brick = {},
		    direction = 0;

		rawData.forEach(function (d, idx) {
			if ((0, _utils.isNotDefined)(brick.from)) {
				brick.high = d.high;
				brick.low = d.low;
				brick.startOfYear = d.startOfYear;
				brick.startOfQuarter = d.startOfQuarter;
				brick.startOfMonth = d.startOfMonth;
				brick.startOfWeek = d.startOfWeek;

				brick.from = idx;
				brick.fromDate = dateAccessor(d);
				// indexMutator(brick, index++);
				dateMutator(brick, dateAccessor(d));
			}
			brick.volume = (brick.volume || 0) + d.volume;

			var prevCloseToHigh = prevBrickClose - pricingMethod(d).high,
			    prevCloseToLow = prevBrickClose - pricingMethod(d).low,
			    prevOpenToHigh = prevBrickOpen - pricingMethod(d).high,
			    prevOpenToLow = prevBrickOpen - pricingMethod(d).low,
			    priceMovement = Math.min(Math.abs(prevCloseToHigh), Math.abs(prevCloseToLow), Math.abs(prevOpenToHigh), Math.abs(prevOpenToLow));

			brick.high = Math.max(brick.high, d.high);
			brick.low = Math.min(brick.low, d.low);

			if (!brick.startOfYear) {
				brick.startOfYear = d.startOfYear;
				if (brick.startOfYear) {
					dateMutator(brick, dateAccessor(d));
					// brick.displayDate = d.displayDate;
				}
			}

			if (!brick.startOfQuarter) {
				brick.startOfQuarter = d.startOfQuarter;
				if (brick.startOfQuarter && !brick.startOfYear) {
					dateMutator(brick, dateAccessor(d));
					// brick.displayDate = d.displayDate;
				}
			}

			if (!brick.startOfMonth) {
				brick.startOfMonth = d.startOfMonth;
				if (brick.startOfMonth && !brick.startOfQuarter) {
					dateMutator(brick, dateAccessor(d));
					// brick.displayDate = d.displayDate;
				}
			}
			if (!brick.startOfWeek) {
				brick.startOfWeek = d.startOfWeek;
				if (brick.startOfWeek && !brick.startOfMonth) {
					dateMutator(brick, dateAccessor(d));
					// brick.displayDate = d.displayDate;
				}
			}

			// d.brick = JSON.stringify(brick);
			if (brickSize(d)) {
				var noOfBricks = Math.floor(priceMovement / brickSize(d));

				brick.open = Math.abs(prevCloseToHigh) < Math.abs(prevOpenToHigh) || Math.abs(prevCloseToLow) < Math.abs(prevOpenToLow) ? prevBrickClose : prevBrickOpen;

				if (noOfBricks >= 1) {
					var j = 0;
					for (j = 0; j < noOfBricks; j++) {
						brick.close = brick.open < pricingMethod(d).high ?
						// if brick open is less than current price it means it is green/hollow brick
						brick.open + brickSize(d) : brick.open - brickSize(d);
						direction = brick.close > brick.open ? 1 : -1;
						brick.direction = direction;
						brick.to = idx;
						brick.toDate = dateAccessor(d);
						// brick.diff = brick.open - brick.close;
						// brick.atr = d.atr;
						brick.fullyFormed = true;
						renkoData.push(brick);

						prevBrickClose = brick.close;
						prevBrickOpen = brick.open;

						var newBrick = {
							high: brick.high,
							low: brick.low,
							open: brick.close,
							startOfYear: false,
							startOfMonth: false,
							startOfQuarter: false,
							startOfWeek: false
						};
						brick = newBrick;
						brick.from = idx;
						brick.fromDate = dateAccessor(d);
						// indexMutator(brick, index + j);
						dateMutator(brick, dateAccessor(d));
						brick.volume = (brick.volume || 0) + d.volume;
					}
					index = index + j - 1;
					brick = {};
				} else {
					if (idx === rawData.length - 1) {
						brick.close = direction > 0 ? pricingMethod(d).high : pricingMethod(d).low;
						brick.to = idx;
						brick.toDate = dateAccessor(d);
						dateMutator(brick, dateAccessor(d));
						brick.fullyFormed = false;
						renkoData.push(brick);
					}
				}
			}
		});
		return renkoData;
	}
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = _extends({}, _defaultOptionsForComputation.Renko, x);
		return calculator;
	};

	calculator.dateMutator = function (x) {
		if (!arguments.length) return dateMutator;
		dateMutator = x;
		return calculator;
	};
	calculator.dateAccessor = function (x) {
		if (!arguments.length) return dateAccessor;
		dateAccessor = x;
		return calculator;
	};

	return calculator;
};

var _utils = require("../utils");

var _atr = require("./atr");

var _atr2 = _interopRequireDefault(_atr);

var _defaultOptionsForComputation = require("./defaultOptionsForComputation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=renko.js.map