"use strict";

import React from "react";
import { extent } from "d3-array";
import { set } from "d3-collection";
import flattenDeep from "lodash.flattendeep";

import Chart from "../Chart";

import {
	isObject,
	getClosestItem,
	zipper,
	isDefined,
	isNotDefined,
	functor,
	mapObject
} from "./index";

export function getChartOrigin(origin, contextWidth, contextHeight) {
	const originCoordinates = typeof origin === "function"
		? origin(contextWidth, contextHeight)
		: origin;
	return originCoordinates;
}

export function getDimensions({ width, height }, chartProps) {

	const chartWidth = (chartProps.width || width);
	const chartHeight = (chartProps.height || height);

	return {
		availableWidth: width,
		availableHeight: height,
		width: chartWidth,
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

export function getNewChartConfig(innerDimension, children) {

	return React.Children.map(children, (each) => {
		if (each.type.toString() === Chart.toString()) {
			const chartProps = {
				...Chart.defaultProps,
				...each.props
			};
			const { id, origin, padding, yExtents: yExtentsProp, yScale, flipYScale, yExtentsCalculator } = chartProps;
			const { width, height, availableWidth, availableHeight } = getDimensions(innerDimension, chartProps);
			const { yPan, yPanEnabled = false } = chartProps;
			// var { yMousePointerRectWidth: rectWidth, yMousePointerRectHeight: rectHeight, yMousePointerArrowWidth: arrowWidth } = each.props;
			// var mouseCoordinates = { at, yDisplayFormat, rectHeight, rectWidth, arrowWidth };
			const yExtents = isDefined(yExtentsProp)
				? (Array.isArray(yExtentsProp) ? yExtentsProp : [yExtentsProp]).map(functor)
				: undefined;

			if (
				Array.isArray(yExtentsProp)
				&& yExtentsProp.length === 2
			) {
				const [a, b] = yExtentsProp;
				if (typeof a == "number" && typeof b == "number") {
					yScale.domain([a, b]);
				}
			}
			// console.log(yExtentsProp, yExtents);
			return {
				id,
				origin: functor(origin)(availableWidth, availableHeight),
				padding,
				yExtents,
				yExtentsCalculator,
				flipYScale,
				yScale: setRange(yScale.copy(), height, padding, flipYScale),
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
	const realYDomain =  (yScale.invert)
		? extent(allYValues)
		: set(allYValues).values();

	return realYDomain;
}


export function getChartConfigWithUpdatedYScales(chartConfig,
	{ plotData, xAccessor, displayXAccessor, fullData },
	xDomain,
	dy,
	chartsToPan) {

	const yDomains = chartConfig
		.map(({ yExtentsCalculator, yExtents, yScale }) => {

			const realYDomain = isDefined(yExtentsCalculator)
				? yExtentsCalculator({ plotData, xDomain, xAccessor, displayXAccessor, fullData })
				: yDomainFromYExtents(yExtents, yScale, plotData);

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
			// console.log(yPan, yPanEnabled, another, domain, realYDomain, prevYDomain);
			return {
				...config,
				yScale: setRange(yScale.copy().domain(domain), height, padding, flipYScale),
				realYDomain,
			};
			// return { ...config, yScale: yScale.copy().domain(domain).range([height - padding, padding]) };
		});

	const updatedChartConfig = combine(chartConfig, yDomains);
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
