"use strict";

import first from "lodash.first";
import last from "lodash.last";
import set from "lodash.set";
import get from "lodash.get";

import { getClosestItemIndexes, isDefined, isNotDefined, isArray } from "../utils/utils";
import eodIntervalCalculator from "./eodIntervalCalculator";
import slidingWindow from "../utils/slidingWindow";
import accumulatingWindow from "../utils/accumulatingWindow";
import zipper from "../utils/zipper";

function extentsWrapper(data, inputXAccessor, realXAccessor, allowedIntervals, scale, canShowTheseMany) {
	var inputXAccessor, interval, width, currentInterval, currentDomain, currentPlotData;

	function domain([left, right], xAccessor) {
		var plotData = currentPlotData, intervalToShow = currentInterval, domain = currentDomain;

		if (isNotDefined(interval) && isArray(allowedIntervals)) {
			currentInterval = isDefined(currentInterval) ? currentInterval : allowedIntervals[0];
			let dataForCurrentInterval = data[currentInterval];

			let leftIndex = getClosestItemIndexes(dataForCurrentInterval, left, xAccessor).right;
			let rightIndex = getClosestItemIndexes(dataForCurrentInterval, right, xAccessor).left;

			let newLeft = inputXAccessor(dataForCurrentInterval[leftIndex]);
			let newRight = inputXAccessor(dataForCurrentInterval[rightIndex]);

			for (let i = 0; i < allowedIntervals.length; i++) {
				let eachInterval = allowedIntervals[i];
				let dataForInterval = data[eachInterval];

				let newLeftIndex = getClosestItemIndexes(dataForInterval, newLeft, inputXAccessor).right;
				let newRightIndex = getClosestItemIndexes(dataForInterval, newRight, inputXAccessor).left;

				let filteredData = dataForInterval.slice(newLeftIndex, newRightIndex);

				if (canShowTheseMany(width, filteredData.length)) {
					domain = currentInterval === eachInterval
						? [left, right]
						: [realXAccessor(first(filteredData)), realXAccessor(last(filteredData))] // TODO fix me later
					plotData = filteredData;
					intervalToShow = eachInterval;
					break;
				}
			}
		} else if (isDefined(interval) && allowedIntervals.indexOf(interval) > -1) {
			// if interval is defined and allowedInterval is not defined, it is an error
			let dataForInterval = data[interval];
			let newLeftIndex = getClosestItemIndexes(dataForInterval, left, xAccessor).right;
			let newRightIndex = getClosestItemIndexes(dataForInterval, right, xAccessor).left;

			let filteredData = dataForInterval.slice(newLeftIndex, newRightIndex);

			if (canShowTheseMany(width, filteredData.length)) {
				domain = [realXAccessor(first(filteredData)), realXAccessor(last(filteredData))];
				plotData = filteredData;
				intervalToShow = interval;
			}
		} else if (isNotDefined(interval) && isNotDefined(allowedIntervals)) {
			// interval is not defined and allowedInterval is not defined also.
			let dataForInterval = data;
			let newLeftIndex = getClosestItemIndexes(dataForInterval, left, xAccessor).right;
			let newRightIndex = getClosestItemIndexes(dataForInterval, right, xAccessor).left;

			let filteredData = dataForInterval.slice(newLeftIndex, newRightIndex);

			if (canShowTheseMany(width, filteredData.length)) {
				domain = realXAccessor == xAccessor
					? [left, right]
					: [realXAccessor(first(filteredData)), realXAccessor(last(filteredData))];
				plotData = filteredData;
				intervalToShow = interval;
			}
		}


		if (isNotDefined(plotData)) throw new Error("Initial render and cannot display any data");
		var updatedScale = (scale.isPolyLinear && scale.isPolyLinear() && scale.data)
			? scale.copy().data(plotData)
			: scale.copy();

		updatedScale.domain(domain);
		return { plotData, interval: intervalToShow, scale: updatedScale };
	}
	domain.interval = function(x) {
		if (!arguments.length) return interval;
		interval = x;
		return domain;
	};
	domain.width = function(x) {
		if (!arguments.length) return width;
		width = x;
		return domain;
	};
	domain.currentInterval = function(x) {
		if (!arguments.length) return currentInterval;
		currentInterval = x;
		return domain;
	};
	domain.currentDomain = function(x) {
		if (!arguments.length) return currentDomain;
		currentDomain = x;
		return domain;
	};
	domain.currentPlotData = function(x) {
		if (!arguments.length) return currentPlotData;
		currentPlotData = x;
		return domain;
	};
	return domain;
}

function canShowTheseManyPeriods(width, arrayLength) {
	var threshold = 0.5; // number of datapoints per 1 px
	return arrayLength < width * threshold
}

export default function() {

	var allowedIntervals, xAccessor, discontinous = false,
		index, map, scale, calculator = [], intervalCalculator = eodIntervalCalculator,
		canShowTheseMany = canShowTheseManyPeriods;

	function evaluate(data) {
		if (discontinous
				&& (isNotDefined(scale.isPolyLinear) 
						|| (isDefined(scale.isPolyLinear) && !scale.isPolyLinear()))) {
			throw new Error("you need a scale that is capable of handling discontinous data. change the scale prop or set discontinous to false");
		}
		var realXAccessor = discontinous ? d => get(d, index) : xAccessor;

		var xScale = (discontinous && isDefined(scale.isPolyLinear) && scale.isPolyLinear())
			? scale.copy().indexAccessor(realXAccessor).dateAccessor(xAccessor)
			: scale
		// if any calculator gives a discontinious output and discontinous = false throw error

		var calculate = intervalCalculator()
			.doIt(isDefined(xScale.isPolyLinear))
			.allowedIntervals(allowedIntervals);

		var mappedData = calculate(data.map(map));

		if (discontinous) {
			calculator.unshift(values => values.map((d, i) => set(d, index, i)));
		}

		calculator.forEach(each => {
			var newData;
			if (isArray(mappedData)) {
				newData = each(mappedData);
			} else {
				newData = {};
				Object.keys(mappedData)
					.forEach(key => {
						newData[key] = each(mappedData[key]);
					});
			}
			mappedData = newData;
		});

		return {
			xAccessor: realXAccessor,
			inputXAccesor: xAccessor,
			initialDomainCalculator: extentsWrapper(mappedData, xAccessor, realXAccessor, allowedIntervals, xScale, canShowTheseMany),
			domainCalculator: extentsWrapper(mappedData, xAccessor, realXAccessor, allowedIntervals, xScale, canShowTheseMany),
		}
	}
	evaluate.allowedIntervals = function(x) {
		if (!arguments.length) return allowedIntervals;
		allowedIntervals = x;
		return evaluate;
	};
	evaluate.intervalCalculator = function(x) {
		if (!arguments.length) return intervalCalculator;
		intervalCalculator = x;
		return evaluate;
	};
	evaluate.xAccessor = function(x) {
		if (!arguments.length) return xAccessor;
		xAccessor = x;
		return evaluate;
	};
	evaluate.discontinous = function(x) {
		if (!arguments.length) return discontinous;
		discontinous = x;
		return evaluate;
	};
	evaluate.index = function(x) {
		if (!arguments.length) return index;
		index = x;
		return evaluate;
	};
	evaluate.map = function(x) {
		if (!arguments.length) return map;
		map = x;
		return evaluate;
	};
	evaluate.scale = function(x) {
		if (!arguments.length) return scale;
		scale = x;
		return evaluate;
	};
	evaluate.calculator = function(x) {
		if (!arguments.length) return calculator;
		calculator = x;
		return evaluate;
	};
	evaluate.foobar = function(x) {
		if (!arguments.length) return foobar;
		foobar = x;
		return evaluate;
	};

	return evaluate;
}