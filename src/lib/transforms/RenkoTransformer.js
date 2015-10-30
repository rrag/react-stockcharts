"use strict";

import calculateATR from "../utils/ATRCalculator";
import objectAssign from "object-assign";

import { Renko as defaultOptions } from "./defaultOptions";

function RenkoTransformer() {
	var newOptions;
	function transform(rawData, interval) {
		var { reversalType, fixedBrickSize, dateAccessor, dateMutator, indexAccessor, indexMutator, period, source } = newOptions;

		var brickSize, pricingMethod;
		if (reversalType === "ATR") {
			calculateATR(rawData.D, period);
			brickSize = d => d["atr" + period];
		} else {
			brickSize = d => fixedBrickSize;
		}
		if (source = "hi/lo") {
			pricingMethod = d => ({ high: d.high, low: d.low });
		} else {
			pricingMethod = d => ({ high: d.close, low: d.close });
		}

		var renkoData = [];

		var index = 0, prevBrickClose = rawData.D[index].open, prevBrickOpen = rawData.D[index].open;
		var brick = {}, direction = 0;

		rawData.D.forEach( function(d) {
			if (brick.from === undefined) {
				brick.high = d.high;
				brick.low = d.low;
				brick.startOfYear = d.startOfYear;
				brick.startOfQuarter = d.startOfQuarter;
				brick.startOfMonth = d.startOfMonth;
				brick.startOfWeek = d.startOfWeek;

				brick.from = indexAccessor(d);
				brick.fromDate = dateAccessor(d);
				indexMutator(brick, index++);
				dateMutator(brick, dateAccessor(d));
			}
			brick.volume = (brick.volume || 0) + d.volume;

			var prevCloseToHigh = (prevBrickClose - pricingMethod(d).high),
				prevCloseToLow = (prevBrickClose - pricingMethod(d).low),
				prevOpenToHigh = (prevBrickOpen - pricingMethod(d).high),
				prevOpenToLow = (prevBrickOpen - pricingMethod(d).low),
				priceMovement = Math.min(
					Math.abs(prevCloseToHigh),
					Math.abs(prevCloseToLow),
					Math.abs(prevOpenToHigh),
					Math.abs(prevOpenToLow));


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

				brick.open = (Math.abs(prevCloseToHigh) < Math.abs(prevOpenToHigh)
					|| Math.abs(prevCloseToLow) < Math.abs(prevOpenToLow))
								? prevBrickClose
								: prevBrickOpen;

				if (noOfBricks >= 1) {
					for (var j = 0; j < noOfBricks; j++) {
						brick.close = (brick.open < pricingMethod(d).high)
										// if brick open is less than current price it means it is green/hollow brick
											? brick.open + brickSize(d)
											: brick.open - brickSize(d);
						direction = brick.close > brick.open ? 1 : -1;
						brick.direction = direction;
						brick.to = indexAccessor(d);
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
						brick.from = indexAccessor(d);
						brick.fromDate = dateAccessor(d);
						indexMutator(brick, index + j);
						dateMutator(brick, dateAccessor(d));
						brick.volume = (brick.volume || 0) + d.volume;
					}
					index = index + j - 1;
					brick = {};
				} else {
					if (indexAccessor(d) === rawData.D.length - 1) {
						brick.close = direction > 0 ? pricingMethod(d).high : pricingMethod(d).low;
						brick.to = indexAccessor(d);
						brick.toDate = dateAccessor(d);
						dateMutator(brick, dateAccessor(d));

						brick.fullyFormed = false;
						renkoData.push(brick);
					}
				}
			}

		});
		return {"D": renkoData};
	};

	transform.options = function(opt) {
		newOptions = objectAssign({}, defaultOptions, opt);
		return newOptions;
	};
	return transform;
}

module.exports = RenkoTransformer;
