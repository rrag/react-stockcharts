"use strict";

import React from "react";
import d3 from "d3";

import Chart from "../Chart";

import { flattenData } from "./ScaleUtils";
import { firstDefined, lastDefined } from "./OverlayUtils";
import { isDefined, isArray, isObject, flattenDeep, getClosestItem, getClosestItemIndexes, overlayColors, pluck, keysAsArray } from "./utils";
import zipper from "./zipper";
import merge from "./merge";
import slidingWindow from "./slidingWindow";


export function getChartOrigin(origin, contextWidth, contextHeight) {
	var originCoordinates = typeof origin === "function"
		? origin(contextWidth, contextHeight)
		: origin;
	return originCoordinates;
};
export function getDimensions({width, height}, chartProps) {

	var chartWidth = (chartProps.width || width);
	var chartHeight = (chartProps.height || height);

	return {
		availableWidth: width,
		availableHeight: height,
		width: chartWidth,
		height: chartHeight
	};
};
/*export getCurrentCanvasContext(canvasList, chartId) {
	var canvasContextList = canvasList.filter((each) => parseInt(each.id, 10) === chartId);
	var canvasContext = canvasContextList.length > 0 ? canvasContextList[0].context : undefined;
	return canvasContext;
}*/


function values(func) {
	return (d) => {
		var obj = func(d);
		return isObject(obj) ? Object.keys(obj).map(key => obj[key]) : obj;
	}
};

export function getNewChartConfig(innerDimension, children) {

	return React.Children.map(children, (each) => {
		if (each.type === Chart) {
			var { id, origin, padding, yExtents: yExtentsProp, yScale } = each.props;
			var { width, height, availableWidth, availableHeight } = getDimensions(innerDimension, each.props);
			var { yMousePointerDisplayLocation: at, yMousePointerDisplayFormat: format } = each.props
			var mouseCoordinates = { at, format };
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
	}).filter(each => each !== undefined);
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
		.map(values => flattenDeep(values))
		.map(values => d3.extent(values));

	var combine = zipper()
		.combine((config, domain) => {
			var { padding: { top, bottom }, height, width, yScale } = config;
			// console.log(height, width);
			return { ...config, yScale: yScale.copy().domain(domain).range([height - top, bottom]) };
		})

	var updatedChartConfig = combine(chartConfig, yDomains)
	return updatedChartConfig;
};
export function getDataForInterval(data, ) {

}
export function getCurrentItem(xScale, xAccessor, mouseXY, plotData) {
	var xValue = xScale.invert(mouseXY[0]);
	// console.log(xValue, xAccessor);
	var item = getClosestItem(plotData, xValue, xAccessor);
	return item;
};
