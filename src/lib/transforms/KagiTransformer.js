"use strict";


import calculateATR from "../utils/ATRCalculator";
import objectAssign from "object-assign";

var defaultOptions = {
	period: 14,
	pricingMethod: (d) => d.close
};

function KagiTransformer() {
	var newOptions;
	function transform(data) {
		var { period, pricingMethod } = newOptions;

		calculateATR(data.D, period);
		var reversalThreshold = function (d) { return d["atr" + period]; };

		var { dateAccessor, dateMutator, indexMutator } = newOptions;

		var kagiData = [];

		var index = 0, prevPeak, prevTrough, direction;
		var line = {};

		data.D.forEach( function (d) {
			if (line.from === undefined) {
				indexMutator(line, index++);
				dateMutator(line, dateAccessor(d));
				/*line.displayDate = d.displayDate;
				line.fromDate = d.displayDate;
				line.toDate = d.displayDate;*/
				line.from = dateAccessor(d);

				if (!line.open) line.open = d.open;
				line.high = d.high;
				line.low = d.low;
				if (!line.close) line.close = pricingMethod(d);
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

			var priceMovement = (pricingMethod(d) - line.close);

			if ((line.close > line.open /* going up */ && priceMovement > 0 /* and moving in same direction */)
					|| (line.close < line.open /* going down */ && priceMovement < 0 /* and moving in same direction */)) {
				line.close = pricingMethod(d);
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
				/*line.prevPeak = prevPeak;
				line.prevTrough = prevTrough;*/
				var nextChangePoint, nextChangeTo;
				if (direction < 0 /* if direction so far has been -ve*/) {
					// compare with line.close becomes prevTrough
					if (prevPeak === undefined) prevPeak = line.open;
					prevTrough = line.close;
					if (pricingMethod(d) > prevPeak) {
						nextChangePoint = prevPeak;
						nextChangeTo = "yang";
					}
				} else {
					if (prevTrough === undefined) prevTrough = line.open;
					prevPeak = line.close;
					if (pricingMethod(d) < prevTrough) {
						nextChangePoint = prevTrough;
						nextChangeTo = "yin";
					}
				}
				if (line.startAs === undefined) {
					line.startAs = direction > 0 ? "yang" : "yin";
				}

				var startAs = line.changeTo || line.startAs;
				kagiData.push(line);
				direction = -1 * direction; // direction is reversed

				line = {
					open: nextLineOpen
					, close: pricingMethod(d)
					, startAs: startAs
					, changePoint: nextChangePoint
					, changeTo: nextChangeTo
				};
			}
		});

		return {"D": kagiData};
	};

	transform.options = function(opt) {
		newOptions = objectAssign({}, defaultOptions, opt);
		return newOptions;
	};
	return transform;
}


module.exports = KagiTransformer;
