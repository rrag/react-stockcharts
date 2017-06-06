"use strict";

import {
	first,
	last,
	getClosestItemIndexes,
	isNotDefined,
	getLogger,
} from "../utils";

const log = getLogger("evaluator");

function extentsWrapper(xAccessor, useWholeData, clamp, pointsPerPxThreshold) {
	function domain(data, inputDomain, xAccessor, initialXScale, currentPlotData, currentDomain) {
		if (useWholeData) {
			return { plotData: data, domain: inputDomain };
		}

		const left = first(inputDomain);
		const right = last(inputDomain);

		const filteredData = getFilteredResponse(data, left, right, xAccessor);
		const clampedDomain = [
			Math.max(left, xAccessor(first(data)) - 1),
			Math.min(right, xAccessor(last(data)) + 1)
		];

		const realInputDomain = xAccessor === xAccessor
			? (clamp ? clampedDomain : inputDomain)
			: [xAccessor(first(filteredData)), xAccessor(last(filteredData))];

		const xScale = initialXScale.copy().domain(realInputDomain);

		const width = Math.floor(xScale(xAccessor(last(filteredData)))
			- xScale(xAccessor(first(filteredData))));

		let plotData, domain;

		const chartWidth = last(xScale.range()) - first(xScale.range());

		log(`Trying to show ${filteredData.length} in ${width}px,`
			+ ` I can show up to ${showMax(width, pointsPerPxThreshold)} in that width. `
			+ `Also FYI the entire chart width is ${chartWidth}px and pointsPerPxThreshold is ${pointsPerPxThreshold}`);

		if (canShowTheseManyPeriods(width, filteredData.length, pointsPerPxThreshold)) {
			plotData = filteredData;
			domain = realInputDomain;
			log("AND IT WORKED");
		} else {
			plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width, pointsPerPxThreshold));
			domain = currentDomain || [xAccessor(first(plotData)), xAccessor(last(plotData))];

			const newXScale = xScale.copy().domain(domain);
			const newWidth = Math.floor(newXScale(xAccessor(last(plotData)))
				- newXScale(xAccessor(first(plotData))));

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
	const newLeftIndex = getClosestItemIndexes(data, left, xAccessor).right;
	const newRightIndex = getClosestItemIndexes(data, right, xAccessor).left;

	const filteredData = data.slice(newLeftIndex, newRightIndex + 1);
	// console.log(right, newRightIndex, dataForInterval.length);

	return filteredData;
}

export default function({
	xAccessor, xScale, useWholeData, clamp, pointsPerPxThreshold
}) {
	return extentsWrapper(
		xAccessor,
		useWholeData || isNotDefined(xScale.invert),
		clamp,
		pointsPerPxThreshold);
}
