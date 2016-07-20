"use strict";

import d3 from "d3";

import { merge, isNotDefined } from "../../utils";
import atr from "./atr";

import { Kagi as defaultOptions } from "../defaultOptions";

export default function() {

	var { reversalType, period: windowSize, reversal, source } = defaultOptions;
	var { dateAccessor, dateMutator } = defaultOptions;

	function calculator(data) {
		var reversalThreshold;

		if (reversalType === "ATR") {
			// calculateATR(rawData, period);
			var atrAlgorithm = atr().windowSize(windowSize);

			var atrCalculator = merge()
				.algorithm(atrAlgorithm)
				.merge((d, c) => { d["atr" + windowSize] = c; } );

			atrCalculator(data);
			reversalThreshold = d => d["atr" + windowSize];
		} else {
			reversalThreshold = d3.functor(reversal);
		}

		var kagiData = [];

		var prevPeak, prevTrough, direction;
		var line = {};

		data.forEach(function(d) {
			if (isNotDefined(line.from)) {
				dateMutator(line, dateAccessor(d));
				line.from = dateAccessor(d);

				if (!line.open) line.open = d.open;
				line.high = d.high;
				line.low = d.low;
				if (!line.close) line.close = source(d);
				line.startOfYear = d.startOfYear;
				line.startOfQuarter = d.startOfQuarter;
				line.startOfMonth = d.startOfMonth;
				line.startOfWeek = d.startOfWeek;
			}

			if (!line.startOfYear) {
				line.startOfYear = d.startOfYear;
				if (line.startOfYear) {
					line.date = d.date;
					// line.displayDate = d.displayDate;
				}
			}

			if (!line.startOfQuarter) {
				line.startOfQuarter = d.startOfQuarter;
				if (line.startOfQuarter && !line.startOfYear) {
					line.date = d.date;
					// line.displayDate = d.displayDate;
				}
			}

			if (!line.startOfMonth) {
				line.startOfMonth = d.startOfMonth;
				if (line.startOfMonth && !line.startOfQuarter) {
					line.date = d.date;
					// line.displayDate = d.displayDate;
				}
			}
			if (!line.startOfWeek) {
				line.startOfWeek = d.startOfWeek;
				if (line.startOfWeek && !line.startOfMonth) {
					line.date = d.date;
					// line.displayDate = d.displayDate;
				}
			}
			line.volume = (line.volume || 0) + d.volume;
			line.high = Math.max(line.high, d.high);
			line.low = Math.min(line.low, d.low);
			line.to = dateAccessor(d);

			var priceMovement = (source(d) - line.close);

			// console.log(source(d), priceMovement)
			if ((line.close > line.open /* going up */ && priceMovement > 0 /* and moving in same direction */)
					|| (line.close < line.open /* going down */ && priceMovement < 0 /* and moving in same direction */)) {
				line.close = source(d);
				if (prevTrough && line.close < prevTrough) {
					// going below the prevTrough, so change from yang to yin
					// A yin line forms when a Kagi line breaks below the prior trough.
					line.changePoint = prevTrough;
					if (line.startAs !== "yin") {
						line.changeTo = "yin";
						// line.startAs = "yang";
					}
				}
				if (prevPeak && line.close > prevPeak) {
					// going above the prevPeak, so change from yin to yang
					// A yang line forms when a Kagi line breaks above the prior peak
					line.changePoint = prevPeak;
					if (line.startAs !== "yang") {
						line.changeTo = "yang";
						// line.startAs = "yin";
					}
				}
			} else if ((line.close > line.open /* going up */
							&& priceMovement < 0 /* and moving in other direction */
							&& Math.abs(priceMovement) > reversalThreshold(d) /* and the movement is big enough for reversal */)
					|| (line.close < line.open /* going down */
							&& priceMovement > 0 /* and moving in other direction */
							&& Math.abs(priceMovement) > reversalThreshold(d) /* and the movement is big enough for reversal */)) {
				// reverse direction
				var nextLineOpen = line.close;

				direction = (line.close - line.open) / Math.abs(line.close - line.open);

				var nextChangePoint, nextChangeTo;
				if (direction < 0 /* if direction so far has been -ve*/) {
					// compare with line.close becomes prevTrough
					if (isNotDefined(prevPeak)) prevPeak = line.open;
					prevTrough = line.close;
					if (source(d) > prevPeak) {
						nextChangePoint = prevPeak;
						nextChangeTo = "yang";
					}
				} else {
					if (isNotDefined(prevTrough)) prevTrough = line.open;
					prevPeak = line.close;
					if (source(d) < prevTrough) {
						nextChangePoint = prevTrough;
						nextChangeTo = "yin";
					}
				}
				if (isNotDefined(line.startAs)) {
					line.startAs = direction > 0 ? "yang" : "yin";
				}

				var startAs = line.changeTo || line.startAs;
				line.added = true;
				kagiData.push(line);
				direction = -1 * direction; // direction is reversed

				line = { ...line };
				line.open = nextLineOpen;
				line.close = source(d);
				line.startAs = startAs;
				line.changePoint = nextChangePoint;
				line.changeTo = nextChangeTo;
				line.added = false;
				line.from = undefined;
				line.volume = 0;
			} else {
				// console.log("MOVING IN REV DIR BUT..", line.open, line.close, source(d));
			}
			line.current = source(d);
			var dir = line.close - line.open;
			dir = dir / Math.abs(dir);
			line.reverseAt = dir > 0 ? line.close - reversalThreshold(d) : line.open - reversalThreshold(d);
		});
		if (!line.added) kagiData.push(line);

		return kagiData;
	}
	calculator.reversalType = function(x) {
		if (!arguments.length) return reversalType;
		reversalType = x;
		return calculator;
	};
	calculator.dateMutator = function(x) {
		if (!arguments.length) return dateMutator;
		dateMutator = x;
		return calculator;
	};
	calculator.dateAccessor = function(x) {
		if (!arguments.length) return dateAccessor;
		dateAccessor = x;
		return calculator;
	};
	return calculator;
}