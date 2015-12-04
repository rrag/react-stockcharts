"use strict";

import React from "react";
import d3 from "d3";
import ScaleUtils from "../utils/ScaleUtils";
import OverlayUtils from "../utils/OverlayUtils";
import Utils from "./utils";

var { overlayColors, pluck, keysAsArray } = Utils;

var ChartDataUtil = {
	containsChart(props) {
		return this.getCharts(props).length > 0;
	},
	getCharts(props) {
		return this.getChildren(props.children, /Chart$/);
	},
	getChartDataForChart(props, context) {
		return this.getChartDataForChartNew(context.chartData, props.forChart);
	},
	getCurrentItemForChart(props, context) {
		return this.getCurrentItemForChartNew(context.currentItems, props.forChart);
	},
	getChartDataForChartNew(chartData, chartId) {
		return chartData.filter((each) => each.id === chartId)[0];
	},
	getCurrentItemForChartNew(currentItems, chartId) {
		var currentItem = currentItems.filter((each) => each.id === chartId)[0];
		var item = currentItem !== undefined ? currentItem.data : {};
		return item;
	},
	getChartOrigin(origin, contextWidth, contextHeight) {
		var originCoordinates = typeof origin === "function"
			? origin(contextWidth, contextHeight)
			: origin;
		return originCoordinates;
	},
	getChartData(props, innerDimensions, partialData, fullData, other, domainL, domainR) {
		var charts = this.getCharts(props);

		return charts.map((each) => {
			var chartProps = each.props;
			var config = this.getChartConfigFor(innerDimensions, chartProps, partialData, fullData, other);

			// console.log(config.compareSeries);

			var plot = this.getChartPlotFor(config, partialData, domainL, domainR);

			return {
				id: each.props.id,
				config: config,
				plot: plot,
			};
		});
	},
	getChildren(children, regex) {
		var matchingChildren = [];
		React.Children.forEach(children, (child) => {
			if (React.isValidElement(child) && regex.test(child.props.namespace)) matchingChildren.push(child);
		});
		return matchingChildren;
	},
	getMainChart(children) {
		var eventCapture = this.getChildren(children, /EventCapture$/);
		if (eventCapture.length > 1) throw new Error("only one EventCapture allowed");
		if (eventCapture.length > 0) return eventCapture[0].props.mainChart;
		if (eventCapture.length === 0) return this.getChildren(children, /Chart$/)[0].props.id;
	},
	getClosestItem(plotData, mouseXY, chartData) {
		// console.log(chartData);
		var xValue = chartData.plot.scales.xScale.invert(mouseXY[0]);
		var item = Utils.getClosestItem(plotData, xValue, chartData.config.xAccessor);
		return item;
	},
	getDimensions(innerDimension, chartProps) {

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
	},
	getChartConfigFor(innerDimension, chartProps, partialData, fullData, passThroughProps) {
		var { padding, margin } = chartProps;
		var dimensions = this.getDimensions(innerDimension, chartProps);
		// var indicator = this.getIndicator(chartProps);
		// this.calculateIndicator(fullData, indicator);

		// var accessors = this.getXYAccessors(chartProps, passThroughProps, indicator);
		// identify overlays
		var xAccessor = this.getXAccessor(chartProps, passThroughProps);
		var overlaysToAdd = this.identifyOverlaysToAdd(chartProps);
		var compareBase = this.identifyCompareBase(chartProps);
		var compareSeries = this.identifyCompareSeries(chartProps);
		// console.log(compareBase, compareSeries);
		// calculate overlays
		this.calculateOverlays(fullData, overlaysToAdd);
		// this.calculateRateOfReturn(fullData, compareSeries, compareBase, accessors.yAccessor);

		var origin = typeof chartProps.origin === "function"
			? chartProps.origin(dimensions.availableWidth, dimensions.availableHeight)
			: chartProps.origin;

		var scales = this.defineScales(chartProps, partialData, passThroughProps);

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
			// indicator: indicator,
			// indicatorOptions: indicator && indicator.options(),
			// domain: indicator && indicator.domain && indicator.domain(),
			origin: origin,
			padding: padding,
			xAccessor: xAccessor,
			overlays: overlaysToAdd,
			compareBase: compareBase,
			compareSeries: compareSeries,
			scaleType: scales,
			yTicks: yTicks,
		};
		return config;
	},
	getChartPlotFor(config, partialData, domainL, domainR) {
		var yaccessors = pluck(keysAsArray(config.overlays), "yAccessor");
		// console.log(yaccessors);
		if (config.compareSeries.length > 0) {
			this.updateComparisonData(partialData, config.compareBase, config.compareSeries);
			yaccessors = [(d) => d.compare];
		}
		var xyValues = ScaleUtils.flattenData(partialData
				, [config.xAccessor]
				, yaccessors);

		var overlayValues = this.updateOverlayFirstLast(partialData, config.overlays);
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

		var scales = this.updateScales(
			xyValues
			, config.scaleType
			, partialData
			, config.width
			, config.height
			, config.padding
			, domain);

		if (domainL !== undefined && domainR !== undefined) {
			scales.xScale.domain([domainL, domainR]);
		}

		var plot = {
			overlayValues: overlayValues,
			scales: scales,
		};
		return plot;
	},
	getCompareYAccessors(compareWith) {
		var yAccessors = compareWith.map((eachCompare) => (d) => d["compare_" + eachCompare.id + "_percent"]);
		yAccessors.push((d) => d.compare_base_percent);
		return yAccessors;
	},
	updateComparisonData(partialData, compareBase, compareSeries) {

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

		// console.table(partialData);
		// console.log(partialData[7].compare);
	},

	defineScales(props, data, passThroughProps) {
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
		if (yScale === undefined) {
			yScale = d3.scale.linear();
		}
		return { xScale: xScale, yScale: yScale };
	},
	getIndicator(props) {
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
	},
	getXAccessor(props, passThroughProps) {
		var xAccessor = passThroughProps !== undefined && passThroughProps.xAccessor
			|| props.xAccessor !== undefined && props.xAccessor;
		return xAccessor;
	},
	getXYAccessors(props, passThroughProps, indicator) {
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
	},
	identifyOverlaysToAdd(chartProps) {
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
				overlaysToAdd.push(overlay);
			}
		});
		return overlaysToAdd;
	},
	identifyCompareBase(props) {
		var compareBase;
		React.Children.forEach(props.children, (child) => {
			if (React.isValidElement(child) && /DataSeries$/.test(child.props.namespace)) {
				compareBase = child.props.compareBase;
			}
		});
		return compareBase;
	},
	identifyCompareSeries(props) {
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
	},
	calculateOverlays(fullData, overlays) {
		if (Array.isArray(fullData)) {
			overlays
				.filter((eachOverlay) => eachOverlay.id !== undefined)
				.forEach((overlay) => {
					// OverlayUtils.calculateOverlay(fullData, overlay);
					overlay.indicator.calculate(fullData[key]);
				});
		} else {
			Object.keys(fullData)
				.filter((key) => ["D", "W", "M"].indexOf(key) > -1)
				.forEach((key) => {
					overlays
						.filter((eachOverlay) => eachOverlay.indicator !== undefined)
						.forEach((overlay) => {
							overlay.indicator.calculate(fullData[key]);
							// OverlayUtils.calculateOverlay(fullData[key], overlay);
						});
				});
		}
		// console.table(fullData.M);
		// console.log(overlays);
	},
	calculateIndicator(fullData, indicator) {
		Object.keys(fullData)
			.filter((key) => ["D", "W", "M"].indexOf(key) > -1)
			.forEach((key) => {
				if (indicator) indicator.calculate(fullData[key]);
			});
	},
	updateOverlayFirstLast(data, overlays) {
		// console.log("updateOverlayFirstLast");
		var overlayValues = [];

		overlays
			.forEach((eachOverlay) => {
				// console.log(JSON.stringify(first), Object.keys(first), yAccessor(first));
				overlayValues.push({
					id: eachOverlay.id,
					first: OverlayUtils.firstDefined(data, eachOverlay.yAccessor),
					last: OverlayUtils.lastDefined(data, eachOverlay.yAccessor),
				});
			});
		return overlayValues;
	},
	updateScales(xyValues, scales, data, width, height, padding, overrideDomain) {
		// console.log("updateScales");
		// width = width - margin.left - margin.right/**/
		// height = height - margin.top - margin.bottom/**/

		scales.xScale.range([padding.left, width - padding.right]);
		// if polylinear scale then set data
		if (scales.xScale.isPolyLinear && scales.xScale.isPolyLinear()) {
			scales.xScale.data(data);
		} else {
			// else set the domain
			scales.xScale.domain(d3.extent(xyValues.xValues));
		}

		scales.yScale.range([height - padding.top, padding.bottom]);

		if (overrideDomain !== undefined) {
			scales.yScale.domain(overrideDomain);
		} else {
			var domain = d3.extent(xyValues.yValues);
			scales.yScale.domain(domain);
		}

		return {
			xScale: scales.xScale.copy(),
			yScale: scales.yScale.copy()
		};
	},
	getCurrentItems(chartData, mouseXY, plotData) {
		return chartData
			.map((eachChartData) => {
				var xValue = eachChartData.plot.scales.xScale.invert(mouseXY[0]);
				var item = Utils.getClosestItem(plotData, xValue, eachChartData.config.xAccessor);
				return { id: eachChartData.id, data: item };
			});
	},
	getDataToPlotForDomain(domainL, domainR, data, width, xAccessor) {
		var threshold = 0.5; // number of datapoints per 1 px
		var allowedIntervals = ["D", "W", "M"];
		// console.log(domainL, domainR, data, width);

		var dataForInterval, filteredData, interval, leftX, rightX, leftIndex, rightIndex;
		for (var i = 0; i < allowedIntervals.length; i++) {
			if (!data[allowedIntervals[i]]) continue;
			interval = allowedIntervals[i];
			dataForInterval = data[interval];

			leftIndex = Utils.getClosestItemIndexes(dataForInterval, domainL, xAccessor).left;
			rightIndex = Utils.getClosestItemIndexes(dataForInterval, domainR, xAccessor).right;

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
	}
};

module.exports = ChartDataUtil;
