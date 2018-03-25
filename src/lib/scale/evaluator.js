

import {
	head,
	last,
	getClosestItemIndexes,
	isDefined,
	isNotDefined,
	getLogger,
} from "../utils";

const log = getLogger("evaluator");

function getNewEnd(fallbackEnd, xAccessor, initialXScale, start) {
	const {
		lastItem, lastItemX
	} = fallbackEnd;
	const lastItemXValue = xAccessor(lastItem);
	const [rangeStart, rangeEnd] = initialXScale.range();

	const newEnd = (rangeEnd - rangeStart) / (lastItemX - rangeStart) * (lastItemXValue - start) + start;
	return newEnd;
}

function extentsWrapper(useWholeData, clamp, pointsPerPxThreshold, minPointsPerPxThreshold, flipXScale) {
	function filterData(
		data, inputDomain, xAccessor, initialXScale,
		{ currentPlotData, currentDomain, fallbackStart, fallbackEnd } = {}
	) {
		if (useWholeData) {
			return { plotData: data, domain: inputDomain };
		}

		let left = head(inputDomain);
		let right = last(inputDomain);
		let clampedDomain = inputDomain;

		let filteredData = getFilteredResponse(data, left, right, xAccessor);

		if (filteredData.length === 1 && isDefined(fallbackStart)) {
			left = fallbackStart;
			right = getNewEnd(fallbackEnd, xAccessor, initialXScale, left);

			clampedDomain = [
				left,
				right,
			];
			filteredData = getFilteredResponse(data, left, right, xAccessor);
		}

		if (typeof clamp === "function") {
			clampedDomain = clamp(clampedDomain, [xAccessor(head(data)), xAccessor(last(data))]);
		} else {
			if (clamp === "left" || clamp === "both" || clamp === true) {
				clampedDomain = [
					Math.max(left, xAccessor(head(data))),
					clampedDomain[1]
				];
			}

			if (clamp === "right" || clamp === "both" || clamp === true) {
				clampedDomain = [
					clampedDomain[0],
					Math.min(right, xAccessor(last(data)))
				];
			}
		}

		if (clampedDomain !== inputDomain) {
			filteredData = getFilteredResponse(data, clampedDomain[0], clampedDomain[1], xAccessor);
		}

		const realInputDomain = clampedDomain;
		// [xAccessor(head(filteredData)), xAccessor(last(filteredData))];

		const xScale = initialXScale.copy().domain(realInputDomain);

		let width = Math.floor(xScale(xAccessor(last(filteredData)))
			- xScale(xAccessor(head(filteredData))));

		// prevent negative width when flipXScale
		if (flipXScale && width < 0) {
			width = width * -1;
		}

		let plotData, domain;

		const chartWidth = last(xScale.range()) - head(xScale.range());

		log(`Trying to show ${filteredData.length} points in ${width}px,`
			+ ` I can show up to ${showMaxThreshold(width, pointsPerPxThreshold) - 1} points in that width. `
			+ `Also FYI the entire chart width is ${chartWidth}px and pointsPerPxThreshold is ${pointsPerPxThreshold}`);

		if (canShowTheseManyPeriods(width, filteredData.length, pointsPerPxThreshold, minPointsPerPxThreshold)) {
			plotData = filteredData;
			domain = realInputDomain;
			log("AND IT WORKED");
		} else {
			if (chartWidth > showMaxThreshold(width, pointsPerPxThreshold) && isDefined(fallbackEnd)) {
				plotData = filteredData;
				const newEnd = getNewEnd(fallbackEnd, xAccessor, initialXScale, head(realInputDomain));
				domain = [
					head(realInputDomain),
					newEnd
				];
				// plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width, pointsPerPxThreshold));
				// domain = currentDomain || [xAccessor(head(plotData)), xAccessor(last(plotData))];

				const newXScale = xScale.copy().domain(domain);
				const newWidth = Math.floor(newXScale(xAccessor(last(plotData)))
					- newXScale(xAccessor(head(plotData))));

				log(`and ouch, that is too much, so instead showing ${plotData.length} in ${newWidth}px`);
			} else {
				plotData = currentPlotData || filteredData.slice(filteredData.length - showMax(width, pointsPerPxThreshold));
				domain = currentDomain || [xAccessor(head(plotData)), xAccessor(last(plotData))];

				const newXScale = xScale.copy().domain(domain);
				const newWidth = Math.floor(newXScale(xAccessor(last(plotData)))
					- newXScale(xAccessor(head(plotData))));

				log(`and ouch, that is too much, so instead showing ${plotData.length} in ${newWidth}px`);
			}
		}
		return { plotData, domain };
	}
	return { filterData };
}

function canShowTheseManyPeriods(width, arrayLength, maxThreshold, minThreshold) {
	return arrayLength > showMinThreshold(width, minThreshold) && arrayLength < showMaxThreshold(width, maxThreshold);
}

function showMinThreshold(width, threshold) {
	return Math.max(1, Math.ceil(width * threshold));
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
	xScale, useWholeData, clamp,
	pointsPerPxThreshold, minPointsPerPxThreshold,
	flipXScale
}) {
	return extentsWrapper(
		useWholeData || isNotDefined(xScale.invert),
		clamp,
		pointsPerPxThreshold,
		minPointsPerPxThreshold,
		flipXScale
	);
}
