"use strict";

import React from "react";
import d3 from "d3";

import Chart from "../Chart";

import { flattenData } from "../utils/ScaleUtils";
import { firstDefined, lastDefined } from "../utils/OverlayUtils";
import { isDefined, getClosestItem, getClosestItemIndexes, overlayColors, pluck, keysAsArray } from "./utils";
import { slidingWindow, merge } from "../indicator/calculator";


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

export function getNewChartConfig(innerDimension, children) {

	return React.Children.map(children, (each) => {
		if (each.type === Chart) {
			var { id, origin, padding, yExtents: yExtentsProp, yScale } = each.props;
			var { width, height, availableWidth, availableHeight } = getDimensions(innerDimension, each.props);
			var { yMousePointerDisplayLocation: at, yMousePointerDisplayFormat: format } = each.props
			var mouseCoordinates = { at, format };
			var yExtents = (Array.isArray(yExtentsProp) ? yExtentsProp : [yExtentsProp]).map(d3.functor);
			return { id, origin: d3.functor(origin)(availableWidth, availableHeight), padding, yExtents, yScale, mouseCoordinates, width, height };
		}
		return undefined;
	}).filter(each => each !== undefined);
};

export function getCurrentItem(xScale, xAccessor, mouseXY, plotData) {
	var xValue = xScale.invert(mouseXY[0]);
	// console.log(xValue, xAccessor);
	var item = getClosestItem(plotData, xValue, xAccessor);
	return item;
};
