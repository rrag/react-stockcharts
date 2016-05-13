"use strict";

import d3 from "d3";
import { merge, isNotDefined } from "../../utils";

import atr from "./atr";

import { Renko as defaultOptions } from "../defaultOptions";

export default function() {

	var { reversalType, fixedBrickSize, source, period: windowSize } = defaultOptions;
	var { dateAccessor, dateMutator } = defaultOptions;

	function calculator(rawData) {
		var pricingMethod = source, brickSize;

		if (reversalType === "ATR") {
			// calculateATR(rawData, period);
			var atrAlgorithm = atr().windowSize(windowSize);

			var atrCalculator = merge()
				.algorithm(atrAlgorithm)
				.merge((d, c) => { d["atr" + windowSize] = c; } );

			atrCalculator(rawData);
			brickSize = d => d["atr" + windowSize];
		} else {
			brickSize = d3.functor(fixedBrickSize);
		}

		var renkoData = [];

		var index = 0, prevBrickClose = rawData[index].open, prevBrickOpen = rawData[index].open;
		var brick = {}, direction = 0;

		rawData.forEach(function(d, idx) {
			if (isNotDefined(brick.from)) {
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
					let j = 0;
					for (j = 0; j < noOfBricks; j++) {
						brick.close = (brick.open < pricingMethod(d).high)
										// if brick open is less than current price it means it is green/hollow brick
											? brick.open + brickSize(d)
											: brick.open - brickSize(d);
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
	calculator.reversalType = function(x) {
		if (!arguments.length) return reversalType;
		reversalType = x;
		return calculator;
	};
	calculator.fixedBrickSize = function(x) {
		if (!arguments.length) return fixedBrickSize;
		fixedBrickSize = x;
		return calculator;
	};
	calculator.source = function(x) {
		if (!arguments.length) return source;
		source = x;
		return calculator;
	};
	calculator.windowSize = function(x) {
		if (!arguments.length) return windowSize;
		windowSize = x;
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