"use strict";
var React = require('react'),
	d3 = require('d3'),
	ScaleUtils = require('../utils/ScaleUtils'),
	OverlayUtils = require('../utils/OverlayUtils'),
	Utils = require('../utils/utils'),
	overlayColors = Utils.overlayColors;
var pluck = Utils.pluck;
var keysAsArray = Utils.keysAsArray;


var ChartContainerMixin = {
	containsChart(props) {
		return this.getCharts(props).length > 0;
	},
	getCharts(props) {
		return this.getChildren(props.children, /Chart$/)
	},
	getChildren(children, regex) {
		var newChildren = Array.isArray(children)
			? children
			: [children];

		return newChildren
			.filter((child) => regex.test(child.props.namespace))
	},
	getChartData(props, context, partialData, fullData, other) {

		var charts = this.getCharts(props);
		var innerDimensions = this.getInnerDimensions(context, other);

		return charts.map((each) => {
			var chartProps = each.props;
			var config = this.getChartConfigFor(innerDimensions, chartProps, partialData, fullData, other)
			var plot = this.getChartPlotFor(config, partialData);

			return {
				id : each.props.id,
				config: config,
				plot: plot
			};
		});
	},
	getMainChart(children) {
		var eventCapture = this.getChildren(children, /EventCapture$/);
		if (eventCapture.length > 1) throw new Error("only one EventCapture allowed");
		if (eventCapture.length > 0) return eventCapture[0].props.mainChart;
	},
	getClosestItem(mouseXY, chartData) {
		// console.log(chartData);
		var xValue = chartData.plot.scales.xScale.invert(mouseXY[0]);
		var item = Utils.getClosestItem(this.state._data, xValue, chartData.config.accessors.xAccessor);
		return item;
	},
	getInnerDimensions(ctx, other) {
		// console.log(other);
		if (other === undefined) other = {};
		return {
			width: other.width || ctx._width,
			height: other.height || ctx._height
		}
	},
	getDimensions(innerDimension, chartProps) {

		var availableWidth = innerDimension.width;
		var availableHeight = innerDimension.height;

		var width = chartProps.width || availableWidth;
		var height = chartProps.height || availableHeight

		return {
			availableWidth: availableWidth,
			availableHeight: availableHeight,
			width: width,
			height: height
		}
	},
	getChartConfigFor(innerDimension, chartProps, partialData, fullData, passThroughProps) {
		var dimensions = this.getDimensions(innerDimension, chartProps);
		var accessors = this.getXYAccessors(chartProps, passThroughProps);
		// identify overlays
		var overlaysToAdd = this.identifyOverlaysToAdd(chartProps);
		// console.log(overlaysToAdd);
		// calculate overlays
		this.calculateOverlays(fullData, overlaysToAdd);

		var origin = typeof chartProps.origin === 'function'
			? chartProps.origin(dimensions.availableWidth, dimensions.availableHeight)
			: chartProps.origin;

		var scales = this.defineScales(chartProps, partialData, passThroughProps);

		var config = {
			width: dimensions.width,
			height: dimensions.height,
			origin: origin,
			accessors: accessors,
			overlays: overlaysToAdd,
			scaleType: scales
		};
		return config;
	},
	getChartPlotFor(config, partialData, domainL, domainR) {
		var overlayYAccessors = pluck(keysAsArray(config.overlays), 'yAccessor');

		var xyValues = ScaleUtils.flattenData(partialData
				, [config.accessors.xAccessor]
				, [config.accessors.yAccessor].concat(overlayYAccessors));

		var overlayValues = this.updateOverlayFirstLast(partialData, config.overlays)

		var scales = this.updateScales(
			xyValues
			, config.scaleType
			, partialData
			, config.width
			, config.height);

		if (domainL && domainR) scales.xScale.domain([domainL, domainR])

		//var last = Utils.cloneMe(partialData[partialData.length - 1]);
		var last = partialData[partialData.length - 1];
		//var first = Utils.cloneMe(partialData[0]);
		var first = partialData[0];

		var drawableWidth = scales.xScale(config.accessors.xAccessor(partialData[partialData.length - 1]))
			- scales.xScale(config.accessors.xAccessor(partialData[0]));

		var plot = {
			drawableWidth: drawableWidth,
			overlayValues: overlayValues,
			scales: scales,
			lastItem: last,
			firstItem: first
		}
		return plot;
	},
	defineScales(props, data, passThroughProps) {
		var xScale = props.xScale || props._xScale,
			yScale = props.yScale;

		if (xScale === undefined && passThroughProps) xScale = passThroughProps._xScale;

		if (xScale === undefined) {
			var each = data[0];
			if (typeof each === 'object') {
				Object.keys(each).forEach((key) => {
					if (Object.prototype.toString.call(each[key]) === '[object Date]') {
						xScale = d3.time.scale();
					}
				});
			}
			if (xScale === undefined) xScale = d3.scale.linear();
			//xScale = polyLinearTimeScale();
		}
		if (yScale === undefined) {
			yScale = d3.scale.linear();
		}
		return { xScale: xScale, yScale: yScale };
	},
	getXYAccessors(props, passThroughProps) {
		var accessor = { xAccessor: null, yAccessor: null };

		React.Children.forEach(props.children, (child) => {
			if (['ReStock.DataSeries']
					.indexOf(child.props.namespace) > -1) {
				if (child.props) {

					var xAccessor = passThroughProps !== undefined && passThroughProps._stockScale
						? passThroughProps._xAccessor
						: child.props.xAccessor
					accessor.xAccessor = xAccessor;
					accessor.yAccessor = child.props.yAccessor;
				}
			}
		});
		// yAccessors.push(overlayY);

		return accessor;
	},
	identifyOverlaysToAdd(props) {
		var overlaysToAdd = [];
		React.Children.forEach(props.children, (child) => {
			if (/DataSeries$/.test(child.props.namespace)) {
				React.Children.forEach(child.props.children, (grandChild) => {
					if (/OverlaySeries$/.test(grandChild.props.namespace)) {
						var key = OverlayUtils.getYAccessorKey(props.id, grandChild.props);
						var overlay = {
							id: grandChild.props.id,
							chartId: props.id,
							key: key,
							yAccessor: (d) => d[key],
							options: grandChild.props.options,
							type: grandChild.props.type,
							tooltipLabel: OverlayUtils.getToolTipLabel(grandChild.props),
							stroke: grandChild.stroke || overlayColors(grandChild.props.id)
						};
						overlaysToAdd.push(overlay);
					}
				});
			}
		})
		return overlaysToAdd;
	},
	calculateOverlays(fullData, overlays) {
		if (Array.isArray(fullData)) {
			overlays
				.filter((eachOverlay) => eachOverlay.id !== undefined)
				.forEach((overlay) => {
					OverlayUtils.calculateOverlay(fullData, overlay);
				});
		} else {
			Object.keys(fullData)
				.filter((key) => ['D', 'W', 'M'].indexOf(key) > -1)
				.forEach((key) => {
					overlays
						.filter((eachOverlay) => eachOverlay.id !== undefined)
						.forEach((overlay) => {
							OverlayUtils.calculateOverlay(fullData[key], overlay);
						});
				})
		}
		// console.log(overlays);
	},
	updateOverlayFirstLast(data,
		overlays) {

		// console.log('updateOverlayFirstLast');

		var overlayValues = [];

		overlays
			.forEach((eachOverlay, idx) => {
				// console.log(JSON.stringify(first), Object.keys(first), yAccessor(first));
				overlayValues.push({
					id: eachOverlay.id,
					first: OverlayUtils.firstDefined(data, eachOverlay.yAccessor),
					last: OverlayUtils.lastDefined(data, eachOverlay.yAccessor)
				})/**/
			})
		// console.log(_overlayValues);
		return overlayValues;
	},
	updateScales(xyValues, scales, data, width, height) {
		// console.log('updateScales');
		scales.xScale.range([0, width]);
		// if polylinear scale then set data
		if (scales.xScale.isPolyLinear && scales.xScale.isPolyLinear()) {
			scales.xScale.data(data);
		} else {
			// else set the domain
			scales.xScale.domain(d3.extent(xyValues.xValues));
		}

		scales.yScale.range([height, 0]);

		var domain = d3.extent(xyValues.yValues);
		//var extraPadding = Math.abs(domain[0] - domain[1]) * 0.05;
		//yScale.domain([domain[0] - extraPadding, domain[1] + extraPadding]);
		scales.yScale.domain(domain);

		return {
			xScale: scales.xScale.copy(),
			yScale: scales.yScale.copy()
		};
	},
};

module.exports = ChartContainerMixin;
