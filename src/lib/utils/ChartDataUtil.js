"use strict";

import React from "react";
import d3 from "d3";
import flattenDeep from "lodash.flattendeep";

import EventCapture from "../EventCapture";
import Chart from "../Chart";

import {
	isObject,
	getClosestItem,
	zipper,
	isDefined,
} from "./index";

export function getChartOrigin(origin, contextWidth, contextHeight) {
	var originCoordinates = typeof origin === "function"
		? origin(contextWidth, contextHeight)
		: origin;
	return originCoordinates;
}

export function getDimensions({ width, height }, chartProps) {

	var chartWidth = (chartProps.width || width);
	var chartHeight = (chartProps.height || height);

	return {
		availableWidth: width,
		availableHeight: height,
		width: chartWidth,
		height: chartHeight
	};
}

function values(func) {
	return (d) => {
		var obj = func(d);
		return isObject(obj) ? Object.keys(obj).map(key => obj[key]) : obj;
	};
}

export function shouldShowCrossHairStyle(children) {
	return React.Children.map(children, (each) => {
		if (each.type === EventCapture) {
			return each.props.useCrossHairStyle;
		}
		return undefined;
	}).filter(isDefined)[0];
}

export function getNewChartConfig(innerDimension, children) {

	return React.Children.map(children, (each) => {
		if (each.type === Chart) {
			var { id, origin, padding, yExtents: yExtentsProp, yScale, flipYScale } = each.props;
			var { width, height, availableWidth, availableHeight } = getDimensions(innerDimension, each.props);
			// var { yMousePointerDisplayLocation: at, yMousePointerDisplayFormat: yDisplayFormat } = each.props;
			// var { yMousePointerRectWidth: rectWidth, yMousePointerRectHeight: rectHeight, yMousePointerArrowWidth: arrowWidth } = each.props;
			// var mouseCoordinates = { at, yDisplayFormat, rectHeight, rectWidth, arrowWidth };
			var yExtents = (Array.isArray(yExtentsProp) ? yExtentsProp : [yExtentsProp]).map(d3.functor);
			// console.log(yExtentsProp, yExtents);
			return {
				id,
				origin: d3.functor(origin)(availableWidth, availableHeight),
				padding,
				yExtents,
				flipYScale,
				yScale,
				// mouseCoordinates,
				width,
				height
			};
		}
		return undefined;
	}).filter(each => isDefined(each));
}
export function getCurrentCharts(chartConfig, mouseXY) {
	var currentCharts = chartConfig.filter(eachConfig => {
		var top = eachConfig.origin[1];
		var bottom = top + eachConfig.height;
		return (mouseXY[1] > top && mouseXY[1] < bottom);
	}).map(config => config.id);

	return currentCharts;
}

function setRange(scale, height, padding, flipYScale) {
	if (scale.rangeRoundPoints) {
		if (isNaN(padding)) throw new Error("padding has to be a number for ordinal scale");
		scale.rangeRoundPoints(flipYScale ? [0, height] : [height, 0], padding);
	} else {
		var { top, bottom } = isNaN(padding)
			? padding
			: { top: padding, bottom: padding };

		scale.range(flipYScale ? [top, height - bottom] : [height - bottom, top]);
	}
	return scale;
}

export function getChartConfigWithUpdatedYScales(chartConfig, plotData) {

	var yDomains = chartConfig
		.map(({ yExtents, yScale }) => {
			var yValues = yExtents.map(eachExtent =>
				plotData.map(values(eachExtent)));
			yValues = flattenDeep(yValues);

			var yDomains = (yScale.invert)
				? d3.extent(yValues)
				: d3.set(yValues).values();

			return yDomains;
		});

	var combine = zipper()
		.combine((config, domain) => {
			var { padding, height, yScale, flipYScale } = config;

			return { ...config, yScale: setRange(yScale.copy().domain(domain), height, padding, flipYScale) };
			// return { ...config, yScale: yScale.copy().domain(domain).range([height - padding, padding]) };
		});

	var updatedChartConfig = combine(chartConfig, yDomains);
	return updatedChartConfig;
}

export function getCurrentItem(xScale, xAccessor, mouseXY, plotData) {
	var xValue, item;
	if (xScale.invert) {
		xValue = xScale.invert(mouseXY[0]);
		item = getClosestItem(plotData, xValue, xAccessor);
	} else {
		var d = xScale.range().map((d, idx) => ({ x: Math.abs(d - mouseXY[0]), idx })).reduce((a, b) => a.x < b.x ? a : b);
		item = isDefined(d) ? plotData[d.idx] : plotData[0];
		// console.log(d, item);
	}
	return item;
}
