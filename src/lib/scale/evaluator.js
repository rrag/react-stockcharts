"use strict";

import {
	first,
	last,
	getClosestItemIndexes,
	isDefined,
	isNotDefined,
	identity,
	getLogger,
} from "../utils";

const log = getLogger("evaluator");

function extentsWrapper(inputXAccessor, realXAccessor, useWholeData, clamp, pointsPerPxThreshold) {
	function domain(data, inputDomain, xAccessor, initialXScale, currentPlotData, currentDomain) {
		if (useWholeData) {
			return { plotData: data, domain: inputDomain };
		}

		var left = first(inputDomain);
		var right = last(inputDomain);

		var filteredData = getFilteredResponse(data, left, right, xAccessor);
		var clampedDomain = [
			Math.max(left, realXAccessor(first(data))),
			Math.min(right, realXAccessor(last(data)))
		];

		var realInputDomain = realXAccessor === xAccessor
			? (clamp ? clampedDomain : inputDomain)
			: [realXAccessor(first(filteredData)), realXAccessor(last(filteredData))];

		var xScale = initialXScale.copy().domain(realInputDomain);

		var width = Math.floor(xScale(realXAccessor(last(filteredData)))
			- xScale(realXAccessor(first(filteredData))));

		var plotData, domain;

		var chartWidth = last(xScale.range()) - first(xScale.range());

		log(`Trying to show ${filteredData.length} in ${width}px,`
			+ ` I can show up to ${showMax(width, pointsPerPxThreshold)} in that width. `
			+ `Also FYI the entire chart width is ${chartWidth}px and pointsPerPxThreshold is ${pointsPerPxThreshold}`);

		if (canShowTheseManyPeriods(width, filteredData.length, pointsPerPxThreshold)) {
			plotData = filteredData;
			domain = realInputDomain;
			log("AND IT WORKED");
		} else {
			plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width, pointsPerPxThreshold));
			domain = currentDomain || [realXAccessor(first(plotData)), realXAccessor(last(plotData))];

			var newXScale = xScale.copy().domain(domain);
			var newWidth = Math.floor(newXScale(realXAccessor(last(plotData)))
				- newXScale(realXAccessor(first(plotData))));

			log(`and ouch, that is too much, so instead showing ${plotData.length} in ${newWidth}px`);
		}

		return { plotData, domain };
	}

	return domain;
}

function canShowTheseManyPeriods(width, arrayLength, threshold) {
	return arrayLength > 1 && arrayLength < showMaxThreshold(width, threshold);
}
function showMaxThreshold(width, threshold) {
	return Math.floor(width * threshold);
}

function showMax(width, threshold) {
	return Math.floor(showMaxThreshold(width, threshold) * 0.97);
}

function getFilteredResponse(data, left, right, xAccessor) {
	var newLeftIndex = getClosestItemIndexes(data, left, xAccessor).right;
	var newRightIndex = getClosestItemIndexes(data, right, xAccessor).left;

	var filteredData = data.slice(newLeftIndex, newRightIndex + 1);
	// console.log(right, newRightIndex, dataForInterval.length);

	return filteredData;
}

function compose(funcs) {
	if (funcs.length === 0) {
		return identity;
	}

	if (funcs.length === 1) {
		return funcs[0];
	}

	var [head, ...tail] = funcs;

	return args => tail.reduce((composed, f) => f(composed), head(args));
}

export default function() {

	var xAccessor, useWholeData, width, xScale,
		map, calculator = [], scaleProvider,
		indexAccessor, indexMutator, clamp, pointsPerPxThreshold;

	function evaluate(data) {

		log("evaluation");
		var mappedData = data.map(map);

		var composedCalculator = compose(calculator);

		var calculatedData = composedCalculator(mappedData);
		log("evaluation");

		if (isDefined(scaleProvider)) {
			var scaleProvider2 = scaleProvider
				.inputDateAccessor(xAccessor)
				.indexAccessor(indexAccessor)
				.indexMutator(indexMutator);
			var {
				data: finalData,
				xScale: modifiedXScale,
				xAccessor: realXAccessor,
				displayXAccessor
			} = scaleProvider2(calculatedData);

			return {
				filterData: extentsWrapper(xAccessor, realXAccessor, useWholeData || isNotDefined(modifiedXScale.invert), clamp, pointsPerPxThreshold),
				fullData: finalData,
				xScale: modifiedXScale,
				xAccessor: realXAccessor,
				displayXAccessor,
			};
		}

		return {
			filterData: extentsWrapper(xAccessor, xAccessor, useWholeData || isNotDefined(xScale.invert), clamp, pointsPerPxThreshold),
			fullData: calculatedData,
			xScale,
			xAccessor,
			displayXAccessor: xAccessor,
		};
	}
	evaluate.pointsPerPxThreshold = function(x) {
		if (!arguments.length) return pointsPerPxThreshold;
		pointsPerPxThreshold = x;
		return evaluate;
	};
	evaluate.clamp = function(x) {
		if (!arguments.length) return clamp;
		clamp = x;
		return evaluate;
	};
	evaluate.xAccessor = function(x) {
		if (!arguments.length) return xAccessor;
		xAccessor = x;
		return evaluate;
	};
	evaluate.map = function(x) {
		if (!arguments.length) return map;
		map = x;
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
	evaluate.scaleProvider = function(x) {
		if (!arguments.length) return scaleProvider;
		scaleProvider = x;
		return evaluate;
	};
	evaluate.xScale = function(x) {
		if (!arguments.length) return xScale;
		xScale = x;
		return evaluate;
	};
	evaluate.useWholeData = function(x) {
		if (!arguments.length) return useWholeData;
		useWholeData = x;
		return evaluate;
	};
	evaluate.width = function(x) {
		if (!arguments.length) return width;
		width = x;
		return evaluate;
	};
	evaluate.calculator = function(x) {
		if (!arguments.length) return calculator;
		calculator = x;
		return evaluate;
	};

	return evaluate;
}
