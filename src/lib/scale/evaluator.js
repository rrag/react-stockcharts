"use strict";

import {
	first,
	last,
	getClosestItemIndexes,
	isDefined,
	isNotDefined,
	identity,
} from "../utils";

function extentsWrapper(data, inputXAccessor, realXAccessor, width, useWholeData) {
	function domain(inputDomain, xAccessor, currentPlotData, currentDomain) {
		if (useWholeData) {
			return { plotData: data, domain: inputDomain };
		}

		var left = first(inputDomain);
		var right = last(inputDomain);

		var filteredData = getFilteredResponse(data, left, right, xAccessor);

		var plotData, domain;
		if (canShowTheseManyPeriods(width, filteredData.length)) {
			plotData = filteredData;
			// domain = subsequent ? inputDomain : [realXAccessor(first(plotData)), realXAccessor(last(plotData))]
			domain = realXAccessor === xAccessor ? inputDomain : [realXAccessor(first(plotData)), realXAccessor(last(plotData))];
		} else {
			plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width));
			domain = currentDomain || [realXAccessor(first(plotData)), realXAccessor(last(plotData))];
		}

		return { plotData, domain };
	}

	return domain;
}

function canShowTheseManyPeriods(width, arrayLength) {
	var threshold = 0.75; // number of datapoints per 1 px
	return arrayLength < width * threshold && arrayLength > 1;
}

function showMax(width) {
	var threshold = 0.75; // number of datapoints per 1 px
	return Math.floor(width * threshold);
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
		indexAccessor, indexMutator;

	function evaluate(data) {

		var mappedData = data.map(map);

		var composedCalculator = compose(calculator);
		var calculatedData = composedCalculator(mappedData);

		if (isDefined(scaleProvider)) {
			var {
				data: finalData,
				xScale: modifiedXScale,
				xAccessor: realXAccessor,
				displayXAccessor
			} = scaleProvider(calculatedData, xAccessor, indexAccessor, indexMutator);

			return {
				filterData: extentsWrapper(finalData, xAccessor, realXAccessor, width, useWholeData || isNotDefined(modifiedXScale.invert)),
				xScale: modifiedXScale,
				xAccessor: realXAccessor,
				displayXAccessor,
				lastItem: last(finalData),
			};
		}

		return {
			filterData: extentsWrapper(calculatedData, xAccessor, xAccessor, width, useWholeData || isNotDefined(xScale.invert)),
			xScale,
			xAccessor,
			displayXAccessor: xAccessor,
			lastItem: last(calculatedData),
		};
	}
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