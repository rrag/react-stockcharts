"use strict";

import React from "react";
import d3 from "d3";
import flattenDeep from "lodash.flattendeep";

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
};

export function getDimensions({ width, height }, chartProps) {

	var chartWidth = (chartProps.width || width);
	var chartHeight = (chartProps.height || height);

	return {
		availableWidth: width,
		availableHeight: height,
		width: chartWidth,
		height: chartHeight
	};
};

function values(func) {
	return (d) => {
		var obj = func(d);
		return isObject(obj) ? Object.keys(obj).map(key => obj[key]) : obj;
	};
};

export function getNewChartConfig(innerDimension, children) {

	return React.Children.map(children, (each) => {
		if (each.type === Chart) {
			var { id, origin, padding, yExtents: yExtentsProp, yScale } = each.props;
			var { width, height, availableWidth, availableHeight } = getDimensions(innerDimension, each.props);
			var { yMousePointerDisplayLocation: at, yMousePointerDisplayFormat: yDisplayFormat } = each.props;
			var { yMousePointerRectWidth: rectWidth, yMousePointerRectHeight: rectHeight } = each.props;
			var mouseCoordinates = { at, yDisplayFormat, rectHeight, rectWidth };
			var yExtents = (Array.isArray(yExtentsProp) ? yExtentsProp : [yExtentsProp]).map(d3.functor);
			return {
				id,
				origin: d3.functor(origin)(availableWidth, availableHeight),
				padding,
				yExtents,
				yScale,
				mouseCoordinates,
				width,
				height
			};
		}
		return undefined;
	}).filter(each => isDefined(each));
};
export function getCurrentCharts(chartConfig, mouseXY) {
	var currentCharts = chartConfig.filter(eachConfig => {
		var top = eachConfig.origin[1];
		var bottom = top + eachConfig.height;
		return (mouseXY[1] > top && mouseXY[1] < bottom);
	}).map(config => config.id);

	return currentCharts;
}
export function getChartConfigWithUpdatedYScales(chartConfig, plotData) {
	var yDomains = chartConfig
		.map(({ yExtents }) =>
			yExtents.map(eachExtent =>
				plotData.map(values(eachExtent))))
		.map(_ => flattenDeep(_))
		.map(_ => d3.extent(_));

	var combine = zipper()
		.combine((config, domain) => {
			var { padding: { top, bottom }, height, yScale } = config;
			return { ...config, yScale: yScale.copy().domain(domain).range([height - top, bottom]) };
		});

	var updatedChartConfig = combine(chartConfig, yDomains);
	return updatedChartConfig;
};

export function getCurrentItem(xScale, xAccessor, mouseXY, plotData) {
	var xValue, item;
	if (xScale.invert) {
		xValue = xScale.invert(mouseXY[0]);
		item = getClosestItem(plotData, xValue, xAccessor);
	} else {
		var d = xScale.range().map((d, idx) => ({ x: Math.abs(d - mouseXY[0]), idx})).reduce((a, b) => a.x < b.x ? a : b)
		item = isDefined(d) ? plotData[d.idx] : plotData[0];
		// console.log(d, item);
	}
	return item;
};
