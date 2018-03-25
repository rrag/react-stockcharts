

import React from "react";
import { extent } from "d3-array";
import { set } from "d3-collection";
import flattenDeep from "lodash.flattendeep";

import Chart from "../Chart";

import {
	last,
	isObject,
	getClosestItem,
	zipper,
	isDefined,
	isNotDefined,
	functor,
	mapObject,
	find,
	shallowEqual
} from "./index";

export function getChartOrigin(origin, contextWidth, contextHeight) {
	const originCoordinates = typeof origin === "function"
		? origin(contextWidth, contextHeight)
		: origin;
	return originCoordinates;
}

export function getDimensions({ width, height }, chartProps) {

	const chartHeight = (chartProps.height || height);

	return {
		availableHeight: height,
		width,
		height: chartHeight
	};
}

function values(func) {
	return (d) => {
		const obj = func(d);
		if (isObject(obj)) {
			return mapObject(obj);
		}
		return obj;
	};
}

function isArraySize2AndNumber(yExtentsProp) {
	if (Array.isArray(yExtentsProp) && yExtentsProp.length === 2) {
		const [a, b] = yExtentsProp;
		return (typeof a == "number" && typeof b == "number");
	}
	return false;
}

export function getNewChartConfig(innerDimension, children, existingChartConfig = []) {
	return React.Children.map(children, (each) => {
		if (each && each.type.toString() === Chart.toString()) {
			const chartProps = {
				...Chart.defaultProps,
				...each.props
			};
			const {
				id,
				origin,
				padding,
				yExtents: yExtentsProp,
				yScale: yScaleProp,
				flipYScale,
				yExtentsCalculator
			} = chartProps;

			const yScale = yScaleProp.copy();
			const {
				width, height, availableHeight
			} = getDimensions(innerDimension, chartProps);

			const { yPan } = chartProps;
			let { yPanEnabled } = chartProps;
			// var { yMousePointerRectWidth: rectWidth, yMousePointerRectHeight: rectHeight, yMousePointerArrowWidth: arrowWidth } = each.props;
			// var mouseCoordinates = { at, yDisplayFormat, rectHeight, rectWidth, arrowWidth };
			const yExtents = isDefined(yExtentsProp)
				? (Array.isArray(yExtentsProp) ? yExtentsProp : [yExtentsProp]).map(functor)
				: undefined;

			const prevChartConfig = find(existingChartConfig, d => d.id === id);

			if (isArraySize2AndNumber(yExtentsProp)) {
				if (
					isDefined(prevChartConfig)
					&& prevChartConfig.yPan
					&& prevChartConfig.yPanEnabled
					&& yPan
					&& yPanEnabled
					&& shallowEqual(prevChartConfig.originalYExtentsProp, yExtentsProp)
				) {
					// console.log(prevChartConfig.originalYExtentsProp, yExtentsProp)
					// console.log(prevChartConfig.yScale.domain())
					yScale.domain(prevChartConfig.yScale.domain());
				} else {
					const [a, b] = yExtentsProp;
					yScale.domain([a, b]);
				}
			} else if (isDefined(prevChartConfig) && prevChartConfig.yPanEnabled) {
				if (isArraySize2AndNumber(prevChartConfig.originalYExtentsProp)) {
					// do nothing
				} else {
					yScale.domain(prevChartConfig.yScale.domain());
					yPanEnabled = true;
				}
			}

			return {
				id,
				origin: functor(origin)(width, availableHeight),
				padding,
				originalYExtentsProp: yExtentsProp,
				yExtents,
				yExtentsCalculator,
				flipYScale,
				// yScale: setRange(yScale.copy(), height, padding, flipYScale),
				yScale: yScale,
				yPan,
				yPanEnabled,
				// mouseCoordinates,
				width,
				height
			};
		}
		return undefined;
	}).filter(each => isDefined(each));
}
export function getCurrentCharts(chartConfig, mouseXY) {
	const currentCharts = chartConfig.filter(eachConfig => {
		const top = eachConfig.origin[1];
		const bottom = top + eachConfig.height;
		return (mouseXY[1] > top && mouseXY[1] < bottom);
	}).map(config => config.id);

	return currentCharts;
}

function setRange(scale, height, padding, flipYScale) {
	if (scale.rangeRoundPoints || isNotDefined(scale.invert)) {
		if (isNaN(padding)) throw new Error("padding has to be a number for ordinal scale");
		if (scale.rangeRoundPoints) scale.rangeRoundPoints(flipYScale ? [0, height] : [height, 0], padding);
		if (scale.rangeRound) scale.range(flipYScale ? [0, height] : [height, 0]).padding(padding);
	} else {
		const { top, bottom } = isNaN(padding)
			? padding
			: { top: padding, bottom: padding };

		scale.range(flipYScale ? [top, height - bottom] : [height - bottom, top]);
	}
	return scale;
}

function yDomainFromYExtents(yExtents, yScale, plotData) {
	const yValues = yExtents.map(eachExtent =>
		plotData.map(values(eachExtent)));

	const allYValues = flattenDeep(yValues);
	// console.log(allYValues)
	const realYDomain = (yScale.invert)
		? extent(allYValues)
		: set(allYValues).values();

	return realYDomain;
}


export function getChartConfigWithUpdatedYScales(
	chartConfig,
	{ plotData, xAccessor, displayXAccessor, fullData },
	xDomain,
	dy,
	chartsToPan
) {
	const yDomains = chartConfig
		.map(({ yExtentsCalculator, yExtents, yScale }) => {

			const realYDomain = isDefined(yExtentsCalculator)
				? yExtentsCalculator({ plotData, xDomain, xAccessor, displayXAccessor, fullData })
				: yDomainFromYExtents(yExtents, yScale, plotData);

			// console.log("yScale.domain() ->", yScale.domain())

			const yDomainDY = isDefined(dy)
				? yScale.range().map(each => each - dy).map(yScale.invert)
				: yScale.domain();
			return {
				realYDomain,
				yDomainDY,
				prevYDomain: yScale.domain(),
			};
		});

	const combine = zipper()
		.combine((config, { realYDomain, yDomainDY, prevYDomain }) => {
			const { id, padding, height, yScale, yPan, flipYScale, yPanEnabled = false } = config;

			const another = isDefined(chartsToPan)
				? chartsToPan.indexOf(id) > -1
				: true;
			const domain = yPan && yPanEnabled
				? another ? yDomainDY : prevYDomain
				: realYDomain;

			// console.log(id, yPan, yPanEnabled, another);
			// console.log(domain, realYDomain, prevYDomain);
			const newYScale = setRange(
				yScale.copy().domain(domain), height, padding, flipYScale
			);
			return {
				...config,
				yScale: newYScale,
				realYDomain: realYDomain,
			};
			// return { ...config, yScale: yScale.copy().domain(domain).range([height - padding, padding]) };
		});

	const updatedChartConfig = combine(chartConfig, yDomains);
	// console.error(yDomains, dy, chartsToPan, updatedChartConfig.map(d => d.yScale.domain()));
	// console.log(updatedChartConfig.map(d => ({ id: d.id, domain: d.yScale.domain() })))

	return updatedChartConfig;
}

export function getCurrentItem(xScale, xAccessor, mouseXY, plotData) {
	let xValue, item;
	if (xScale.invert) {
		xValue = xScale.invert(mouseXY[0]);
		item = getClosestItem(plotData, xValue, xAccessor);
	} else {
		const d = xScale.range().map((d, idx) => ({ x: Math.abs(d - mouseXY[0]), idx })).reduce((a, b) => a.x < b.x ? a : b);
		item = isDefined(d) ? plotData[d.idx] : plotData[0];
		// console.log(d, item);
	}
	return item;
}

export function getXValue(xScale, xAccessor, mouseXY, plotData) {

	let xValue, item;
	if (xScale.invert) {
		xValue = xScale.invert(mouseXY[0]);
		if (xValue > xAccessor(last(plotData)) && xScale.value) {
			return Math.round(xValue);
		} else {
			item = getClosestItem(plotData, xValue, xAccessor);
		}
	} else {
		const d = xScale.range().map((d, idx) => ({ x: Math.abs(d - mouseXY[0]), idx })).reduce((a, b) => a.x < b.x ? a : b);
		item = isDefined(d) ? plotData[d.idx] : plotData[0];
		// console.log(d, item);
	}
	return xAccessor(item);
}
