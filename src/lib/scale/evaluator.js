"use strict";

import { first, last, getClosestItemIndexes, isDefined, isNotDefined, isArray } from "../utils/utils";
import eodIntervalCalculator from "./eodIntervalCalculator";
import slidingWindow from "../utils/slidingWindow";
import accumulatingWindow from "../utils/accumulatingWindow";
import zipper from "../utils/zipper";

function getFilteredResponse(dataForInterval, left, right, xAccessor) {
	var newLeftIndex = getClosestItemIndexes(dataForInterval, left, xAccessor).right;
	var newRightIndex = getClosestItemIndexes(dataForInterval, right, xAccessor).left;

	var filteredData = dataForInterval.slice(newLeftIndex, newRightIndex + 1);

	return filteredData;
}

function getDomain(left, right, width, filteredData, predicate, currentDomain, canShowTheseMany, realXAccessor) {
	if (canShowTheseMany(width, filteredData.length)) {
		var domain = predicate
			? [left, right]
			: [realXAccessor(first(filteredData)), realXAccessor(last(filteredData))] // TODO fix me later
		return domain;
	}
	if (process.env.NODE_ENV !== "production") {
		console.warn(`Trying to show ${filteredData.length} items in a width of ${width}px. This is either too much or too few points`);
	}
	return currentDomain;
}

function extentsWrapper(inputXAccessor, realXAccessor, allowedIntervals, canShowTheseMany) {
	var data, inputXAccessor, interval, width, currentInterval, currentDomain, currentPlotData, scale;

	function domain([left, right], xAccessor) {
		var plotData = currentPlotData, intervalToShow = currentInterval, domain;

		if (isNotDefined(interval) && isArray(allowedIntervals)) {
			let dataForCurrentInterval = data[currentInterval || allowedIntervals[0]];

			let leftIndex = getClosestItemIndexes(dataForCurrentInterval, left, xAccessor).right;
			let rightIndex = getClosestItemIndexes(dataForCurrentInterval, right, xAccessor).left;

			let newLeft = inputXAccessor(dataForCurrentInterval[leftIndex]);
			let newRight = inputXAccessor(dataForCurrentInterval[rightIndex]);

			for (let i = 0; i < allowedIntervals.length; i++) {
				let eachInterval = allowedIntervals[i];
				let filteredData = getFilteredResponse(data[eachInterval], left, right, xAccessor)

				domain = getDomain(left, right, width, filteredData,
					realXAccessor == xAccessor && currentInterval === eachInterval, currentDomain,
					canShowTheseMany, realXAccessor);

				if (domain !== currentDomain) {
					plotData = filteredData;
					intervalToShow = eachInterval;
					break;
				}
			}
		} else if (isDefined(interval) && allowedIntervals.indexOf(interval) > -1) {
			// if interval is defined and allowedInterval is not defined, it is an error
			let filteredData = getFilteredResponse(data[interval], left, right, xAccessor)

			domain = getDomain(left, right, width, filteredData,
				realXAccessor == xAccessor, currentDomain,
				canShowTheseMany, realXAccessor);

			if (domain !== currentDomain) {
				plotData = filteredData;
				intervalToShow = interval;
			}
		} else if (isNotDefined(interval) && isNotDefined(allowedIntervals)) {
			// interval is not defined and allowedInterval is not defined also.
			let filteredData = getFilteredResponse(data, left, right, xAccessor)
			domain = getDomain(left, right, width, filteredData,
				realXAccessor == xAccessor, currentDomain,
				canShowTheseMany, realXAccessor);

			if (domain !== currentDomain) {
				plotData = filteredData;
				intervalToShow = null;
			}
		}

		if (isNotDefined(plotData)) {
			// console.log(currentInterval, currentDomain, currentPlotData)
			throw new Error("Initial render and cannot display any data");
		}
		// console.log(scale.range());
		var updatedScale = (scale.isPolyLinear && scale.isPolyLinear() && scale.data)
			? scale.copy().data(plotData)
			: scale.copy();

		updatedScale.domain(domain);
		return { plotData, interval: intervalToShow, scale: updatedScale };
	}
	domain.data = function(x) {
		if (!arguments.length) return data;
		data = x;
		return domain;
	};
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
	domain.scale = function(x) {
		if (!arguments.length) return scale;
		scale = x;
		return domain;
	};
	return domain;
}

function canShowTheseManyPeriods(width, arrayLength) {
	var threshold = 0.75; // number of datapoints per 1 px
	return arrayLength < width * threshold && arrayLength > 1;
}

export default function() {

	var allowedIntervals, xAccessor, discontinous = false,
		indexAccessor, indexMutator, map, scale, calculator = [], intervalCalculator = eodIntervalCalculator,
		canShowTheseMany = canShowTheseManyPeriods;

	function evaluate(data) {
		if (discontinous
				&& (isNotDefined(scale.isPolyLinear) 
						|| (isDefined(scale.isPolyLinear) && !scale.isPolyLinear()))) {
			throw new Error("you need a scale that is capable of handling discontinous data. change the scale prop or set discontinous to false");
		}
		var realXAccessor = discontinous ? indexAccessor : xAccessor;

		var xScale = (discontinous && isDefined(scale.isPolyLinear) && scale.isPolyLinear())
			? scale.copy().indexAccessor(realXAccessor).dateAccessor(xAccessor)
			: scale
		// if any calculator gives a discontinious output and discontinous = false throw error

		var calculate = intervalCalculator()
			.doIt(isDefined(xScale.isPolyLinear))
			.allowedIntervals(allowedIntervals);

		var mappedData = calculate(data.map(map));


		if (discontinous) {
			calculator.unshift(values => values.map((d, i) => {
				indexMutator(d, i);
				return d;
			}));
		}
		// console.log(mappedData);

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

		// console.log(mappedData);
		return {
			fullData: mappedData,
			xAccessor: realXAccessor,
			inputXAccesor: xAccessor,
			domainCalculator: extentsWrapper(xAccessor, realXAccessor, allowedIntervals, canShowTheseMany),
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
	evaluate.indexAccessor = function(x) {
		if (!arguments.length) return indexAccessor;
		indexAccessor = x;
		return evaluate;
	};
	evaluate.indexMutator = function(x) {
		if (!arguments.length) return indexMutator;
		indexMutator = x;
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