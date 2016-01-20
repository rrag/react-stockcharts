"use strict";

import React from "react";
import d3 from "d3";

import { flattenData } from "../utils/ScaleUtils";
import { firstDefined, lastDefined } from "../utils/OverlayUtils";
import { isDefined, getClosestItem, getClosestItemIndexes, overlayColors, pluck, keysAsArray } from "./utils";
import { slidingWindow, merge } from "../indicator/calculator";

export function containsChart(props) {
	return getCharts(props).length > 0;
};

export function getCharts(props) {
	return getChildren(props.children, /Chart$/);
};

export function getChartDataForChart(props, context) {
	return getChartDataForChartNew(context.chartData, props.forChart);
};
export function getCurrentItemForChart(props, context) {
	return getCurrentItemForChartNew(context.currentItems, props.forChart);
};
export function getChartDataForChartNew(chartData, chartId) {
	return chartData.filter((each) => each.id === chartId)[0];
};
export function getCurrentItemForChartNew(currentItems, chartId) {
	var currentItem = currentItems.filter((each) => each.id === chartId)[0];
	var item = currentItem !== undefined ? currentItem.data : {};
	return item;
};
export function getChartOrigin(origin, contextWidth, contextHeight) {
	var originCoordinates = typeof origin === "function"
		? origin(contextWidth, contextHeight)
		: origin;
	return originCoordinates;
};

export function getChartDataConfig(props, innerDimensions, other) {
	var charts = getCharts(props);
	return charts.map((each) => ({
		id: each.props.id,
		config: getChartConfigFor(innerDimensions, each.props, other),
	}));
};

export function getChartData(props, innerDimensions, partialData, fullData, other, domainL, domainR) {
	var charts = getCharts(props);
	calculateChange(fullData);
	return charts.map((each) => {
		var chartProps = each.props;

		var config = getChartConfigFor(innerDimensions, chartProps, other);
		calculateOverlays(fullData, config.overlays);
		var scaleType = defineScales(chartProps, partialData, other);

		// console.log(config.compareSeries);

		var plot = getChartPlotFor(config, scaleType, partialData, domainL, domainR);

		return {
			id: each.props.id,
			config: config,
			scaleType: scaleType,
			plot: plot,
		};
	});
};
export function getChildren(children, regex) {
	var matchingChildren = [];
	React.Children.forEach(children, (child) => {
		if (React.isValidElement(child) && regex.test(child.props.namespace)) matchingChildren.push(child);
	});
	return matchingChildren;
};
export function getMainChart(children) {
	var eventCapture = getChildren(children, /EventCapture$/);
	if (eventCapture.length > 1) throw new Error("only one EventCapture allowed");
	if (eventCapture.length > 0) return eventCapture[0].props.mainChart;
	if (eventCapture.length === 0) return getChildren(children, /Chart$/)[0].props.id;
};

export function getClosest(plotData, mouseXY, chartData) {
	// console.log(chartData);
	var xValue = chartData.plot.scales.xScale.invert(mouseXY[0]);
	var item = getClosestItem(plotData, xValue, chartData.config.xAccessor);
	return item;
};

export function getDimensions(innerDimension, chartProps) {

	var availableWidth = innerDimension.width;
	var availableHeight = innerDimension.height;

	var fullWidth = (chartProps.width || availableWidth);
	var fullHeight = (chartProps.height || availableHeight);

	return {
		availableWidth: availableWidth,
		availableHeight: availableHeight,
		width: fullWidth,
		height: fullHeight
	};
};


export function getChartConfigFor(innerDimension, chartProps, other) {
	var { padding, yDomainUpdate, xDomainUpdate } = chartProps;

	var dimensions = getDimensions(innerDimension, chartProps);
	var xAccessor = getXAccessor(chartProps, other);
	var overlaysToAdd = identifyOverlaysToAdd(chartProps);
	var compareBase = identifyCompareBase(chartProps);
	var compareSeries = identifyCompareSeries(chartProps);

	var origin = typeof chartProps.origin === "function"
		? chartProps.origin(dimensions.availableWidth, dimensions.availableHeight)
		: chartProps.origin;

	var indicatorsWithTicks = overlaysToAdd
		.filter(overlay => overlay.indicator !== undefined)
		.filter(overlay => overlay.indicator.yTicks !== undefined);

	var yTicks;
	if (indicatorsWithTicks.length > 0) {
		yTicks = indicatorsWithTicks.map(overlay => overlay.indicator.yTicks())
			.reduce((ticks1, ticks2) => ticks1.concat(ticks2));
	}

	var config = {
		width: dimensions.width,
		height: dimensions.height,
		mouseCoordinates: {
			at: chartProps.yMousePointerDisplayLocation,
			format: chartProps.yMousePointerDisplayFormat
		},
		yDomainUpdate,
		xDomainUpdate,
		origin: origin,
		padding: padding,
		xAccessor: xAccessor,
		overlays: overlaysToAdd,
		compareBase: compareBase,
		compareSeries: compareSeries,
		yTicks: yTicks,
	};
	return config;
};

export function getChartPlotFor(config, scaleType, partialData, domainL, domainR) {
	var yaccessors = pluck(keysAsArray(config.overlays), "yAccessor");
	// console.log(yaccessors);
	if (config.compareSeries.length > 0) {
		updateComparisonData(partialData, config.compareBase, config.compareSeries);
		yaccessors = [(d) => d.compare];
	}
	var xyValues = flattenData(partialData
			, [config.xAccessor]
			, yaccessors);

	var overlayValues = updateOverlayFirstLast(partialData, config.overlays);
	var indicators = pluck(keysAsArray(config.overlays), "indicator");
	var domains = indicators
		.filter(indicator => indicator !== undefined)
		.filter(indicator => indicator.domain !== undefined)
		.map(indicator => indicator.domain());

	var domain;
	if (domains.length > 0) {
		domain = domains.reduce((a, b) => {
			return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
		});
	}

	if (!config.yDomainUpdate) {
		domain = scaleType.yScale.domain();
	}

	var scales = {
		xScale: updateXScale(xyValues.xValues, scaleType.xScale, partialData, config.width, config.padding),
		yScale: updateYScale(xyValues.yValues, scaleType.yScale, partialData, config.height, config.padding, domain),
	}

	if (domainL !== undefined && domainR !== undefined) {
		scales.xScale.domain([domainL, domainR]);
	}

	var plot = {
		overlayValues: overlayValues,
		scales: scales,
	};
	return plot;
};

export function getCompareYAccessors(compareWith) {
	var yAccessors = compareWith.map((eachCompare) => (d) => d["compare_" + eachCompare.id + "_percent"]);
	yAccessors.push((d) => d.compare_base_percent);
	return yAccessors;
};

export function updateComparisonData(partialData, compareBase, compareSeries) {
	var first = partialData[0];
	var base = compareBase(first);

	partialData.forEach((d) => {
		d.compare = {};

		d.compare.open = (d.open - base) / base;
		d.compare.high = (d.high - base) / base;
		d.compare.low = (d.low - base) / base;
		d.compare.close = (d.close - base) / base;

		compareSeries.forEach(eachSeries => {
			var key = "compare_" + eachSeries.id;
			d.compare[key] = (eachSeries.yAccessor(d) - eachSeries.yAccessor(first)) / eachSeries.yAccessor(first);
		});

	});
};

export function defineScales(props, data, passThroughProps) {
	var xScale = props.xScale,
		yScale = props.yScale;

	if (xScale === undefined && passThroughProps) xScale = passThroughProps.xScale;

	if (xScale === undefined) {
		var each = data[0];
		if (typeof each === "object") {
			Object.keys(each).forEach((key) => {
				if (Object.prototype.toString.call(each[key]) === "[object Date]") {
					xScale = d3.time.scale();
				}
			});
		}
		if (xScale === undefined) xScale = d3.scale.linear();
		// xScale = polyLinearTimeScale();
	}

	return { xScale: xScale, yScale: yScale };
};

export function getIndicator(props) {
	var indicator;// = new Array();
	React.Children.forEach(props.children, (child) => {
		if (["ReStock.DataSeries"]
				.indexOf(child.props.namespace) > -1) {

			if (child.props && child.props.indicator) {
				var indicatorProp = child.props.indicator;
				indicator = indicatorProp(child.props.options, props, child.props);
			}
		}
	});
	return indicator;
};

export function getXAccessor(props, passThroughProps) {
	var xAccessor = passThroughProps !== undefined && passThroughProps.xAccessor
		|| props.xAccessor !== undefined && props.xAccessor;
	return xAccessor;
};

export function getXYAccessors(props, passThroughProps, indicator) {
	var accessor = { xAccessor: null, yAccessor: null };

	React.Children.forEach(props.children, (child) => {
		if (["ReStock.DataSeries"]
				.indexOf(child.props.namespace) > -1) {
			if (child.props) {

				var xAccessor = passThroughProps !== undefined && passThroughProps.xAccessor
					? passThroughProps.xAccessor
					: child.props.xAccessor;
				accessor.xAccessor = xAccessor;
				accessor.yAccessor = child.props.yAccessor;
			}
		}
	});
	if (!accessor.yAccessor && indicator) {
		accessor.yAccessor = indicator.yAccessor();
	}
	// if (indicator) console.log(indicator.yAccessor());

	return accessor;
};

export function identifyOverlaysToAdd(chartProps) {
	var overlaysToAdd = [];
	React.Children.forEach(chartProps.children, (child) => {
		if (React.isValidElement(child) && /DataSeries$/.test(child.props.namespace)) {
			var { yAccessor } = child.props;
			var indicatorProp = child.props.indicator;
			if (yAccessor === undefined && indicatorProp === undefined) {
				console.error(`Either have yAccessor or indicator which provides a yAccessor for Chart ${ chartProps.id } DataSeries ${ child.props.id }`);
			}
			var indicator = indicatorProp !== undefined ? indicatorProp(child.props.options, chartProps, child.props) : undefined;
			var { stroke, fill } = child.props;
			if (stroke === undefined && indicator !== undefined && indicator.stroke !== undefined) stroke = indicator.stroke();
			if (fill === undefined && indicator !== undefined && indicator.fill !== undefined) fill = indicator.fill();
			var overlay = {
				id: child.props.id,
				chartId: chartProps.id,
				yAccessor: yAccessor || indicator.yAccessor(),
				indicator: indicator,
				stroke: stroke,
				fill: fill,
				// stroke: indicator.options().stroke || overlayColors(child.props.id)
			};
			// console.error(overlay.id, overlay.chartId, overlay.stroke, indicator);
			overlaysToAdd.push(overlay);
		}
	});
	return overlaysToAdd;
};

export function identifyCompareBase(props) {
	var compareBase;
	React.Children.forEach(props.children, (child) => {
		if (React.isValidElement(child) && /DataSeries$/.test(child.props.namespace)) {
			compareBase = child.props.compareBase;
		}
	});
	return compareBase;
};

export function identifyCompareSeries(props) {
	var overlaysToAdd = [];
	React.Children.forEach(props.children, (child) => {
		if (React.isValidElement(child) && /DataSeries$/.test(child.props.namespace)) {
			React.Children.forEach(child.props.children, (grandChild) => {
				if (React.isValidElement(grandChild) && /CompareSeries$/.test(grandChild.props.namespace)) {
					overlaysToAdd.push({
						yAccessor: grandChild.props.yAccessor,
						id: grandChild.props.id,
						stroke: grandChild.props.stroke || overlayColors(grandChild.props.id),
						displayLabel: grandChild.props.displayLabel,
						percentYAccessor: (d) => d.compare["compare_" + grandChild.props.id],
					});
				}
			});
		}
	});
	return overlaysToAdd;
};

export function calculateOverlays(fullData, overlays) {
	if (Array.isArray(fullData)) {
		overlays
			.filter((eachOverlay) => eachOverlay.id !== undefined)
			.forEach((overlay) => {
				overlay.indicator.calculate(fullData);
			});
	} else {
		Object.keys(fullData)
			.filter((key) => ["D", "W", "M"].indexOf(key) > -1)
			.forEach((key) => {
				overlays
					.filter((eachOverlay) => eachOverlay.indicator !== undefined)
					.forEach((overlay) => {
						overlay.indicator.calculate(fullData[key]);
					});
			});
	}
	// console.table(fullData.M);
	// console.log(overlays);
};

function calculateChange(fullData) {
	Object.keys(fullData)
		.filter(key => ["D", "W", "M"].indexOf(key) > -1)
		.forEach(key => {
			var changeAlgorithm = slidingWindow()
				.windowSize(2)
				.accumulator(([prev, now]) => ({
					absolute: now.close - prev.close,
					percent: ((now.close - prev.close) / prev.close) * 100
				}));

			var changeCalculator = merge()
				.algorithm(changeAlgorithm)
				.mergePath("change");

			changeCalculator(fullData[key]);
			// console.log(fullData[key][20]);
		});
}

export function calculateIndicator(fullData, indicator) {
	Object.keys(fullData)
		.filter((key) => ["D", "W", "M"].indexOf(key) > -1)
		.forEach((key) => {
			if (indicator) indicator.calculate(fullData[key]);
		});
};

export function updateOverlayFirstLast(data, overlays) {
	// console.log("updateOverlayFirstLast");
	var overlayValues = [];

	overlays
		.forEach((eachOverlay) => {
			// console.log(JSON.stringify(first), Object.keys(first), yAccessor(first));
			overlayValues.push({
				id: eachOverlay.id,
				first: firstDefined(data, eachOverlay.yAccessor),
				last: lastDefined(data, eachOverlay.yAccessor),
			});
		});
	return overlayValues;
};

export function updateXScale(xValues, xScale, data, width, padding, overrideXDomain) {
	// overrideXDomain is currently ignored
	var copy = xScale.copy();
	copy.range([padding.left, width - padding.right]);
	// if polylinear scale then set data
	if (copy.isPolyLinear && copy.isPolyLinear()) {
		copy.data(data);
	} else {
		// else set the domain
		copy.domain(d3.extent(xValues));
	}
	return copy;
};

export function updateYScale(yValues, yScale, data, height, padding, overrideYDomain) {
	var copy = yScale.copy();

	copy.range([height - padding.top, padding.bottom]);

	if (isDefined(overrideYDomain)) {
		copy.domain(overrideYDomain);
	} else {
		var domain = d3.extent(yValues);
		copy.domain(domain);
	}

	return copy;
};

export function getCurrentItems(chartData, mouseXY, plotData) {
	return chartData
		.map((eachChartData) => {
			var xValue = eachChartData.plot.scales.xScale.invert(mouseXY[0]);
			var item = getClosestItem(plotData, xValue, eachChartData.config.xAccessor);
			return { id: eachChartData.id, data: item };
		});
};

export function getDataToPlotForDomain(domainL, domainR, data, width, xAccessor) {
	var threshold = 0.5; // number of datapoints per 1 px
	var allowedIntervals = ["D", "W", "M"];
	// console.log(domainL, domainR, data, width);

	var dataForInterval, filteredData, interval, leftIndex, rightIndex;

	for (var i = 0; i < allowedIntervals.length; i++) {
		if (!data[allowedIntervals[i]]) continue;
		interval = allowedIntervals[i];
		dataForInterval = data[interval];

		leftIndex = getClosestItemIndexes(dataForInterval, domainL, xAccessor).left;
		rightIndex = getClosestItemIndexes(dataForInterval, domainR, xAccessor).right;

		// leftIndex = leftX.left;
		// rightIndex = rightX.right;

		filteredData = dataForInterval.slice(leftIndex, rightIndex);

		// console.log(filteredData.length, width * threshold);
		if (filteredData.length < width * threshold) break;
	}

	// console.log(leftX, rightX,  (dd[leftX.left]), xAccessor(dd[rightX.right]));

	return {
		interval: interval,
		data: filteredData,
		leftIndex: leftIndex,
		rightIndex: rightIndex
	};
};
