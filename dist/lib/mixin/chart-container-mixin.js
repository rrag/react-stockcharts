"use strict";
var React = require('react/addons'),
	d3 = require('d3'),
	ScaleUtils = require('../utils/scale-utils'),
	OverlayUtils = require('../utils/overlay-utils'),
	Utils = require('../utils/utils'),
	Chart = require('../chart'),
	overlayColors = Utils.overlayColors;
var pluck = Utils.pluck;
var keysAsArray = Utils.keysAsArray;


function getOverlayFromList(overlays, id) {
	return overlays.map(function(each)  {return [each.id, each];})
		.filter(function(eachMap)  {return eachMap[0] === id;})
		.map(function(eachMap)  {return eachMap[1];})[0];
}


var ChartContainerMixin = {
	getDimensions:function(_props, chartProps) {

		var availableWidth = _props._width || this.getAvailableWidth(_props);
		var availableHeight = _props._height || this.getAvailableHeight(_props);

		var width = chartProps.width || availableWidth;
		var height = chartProps.height || availableHeight

		return {
			availableWidth: availableWidth,
			availableHeight: availableHeight,
			width: width,
			height: height
		}
	},
	getChartDataFor:function(_props, chartProps, data, fullData, passThroughProps) {
		var dimensions = this.getDimensions(_props, chartProps);

		var scales = this.defineScales(chartProps, data, passThroughProps);

		var accessors = this.getXYAccessors(chartProps, passThroughProps);
		// identify overlays
		var overlaysToAdd = this.identifyOverlaysToAdd(chartProps);
		// console.log(overlaysToAdd);
		// calculate overlays
		this.calculateOverlays(fullData, overlaysToAdd);

		var overlayYAccessors = pluck(keysAsArray(overlaysToAdd), 'yAccessor');

		var xyValues = ScaleUtils.flattenData(data, [accessors.xAccessor], [accessors.yAccessor].concat(overlayYAccessors));

		var overlayValues = this.updateOverlayFirstLast(data, overlaysToAdd)

		scales = this.updateScales(
			xyValues
			, scales
			, data
			, dimensions.width
			, dimensions.height);

		var last = Utils.cloneMe(data[data.length - 1]);
		var first = Utils.cloneMe(data[0]);
		var origin = typeof chartProps.origin === 'function'
			? chartProps.origin(dimensions.availableWidth, dimensions.availableHeight)
			: chartProps.origin;

		var drawableWidth = scales.xScale(accessors.xAccessor(data[data.length - 1]))
			- scales.xScale(accessors.xAccessor(data[0]));

		var _chartData = {
				width: dimensions.width,
				height: dimensions.height,
				drawableWidth: drawableWidth,
				origin: origin,
				overlayValues: overlayValues,
				overlays: overlaysToAdd,
				accessors: accessors,
				scales: scales,
				lastItem: last,
				firstItem: first
			};
		return _chartData;
	},
	defineScales:function(props, data, passThroughProps) {
		var xScale = props.xScale || props._xScale,
			yScale = props.yScale;

		if (xScale === undefined && passThroughProps) xScale = passThroughProps._xScale;

		if (xScale === undefined) {
			var each = data[0];
			if (typeof each === 'object') {
				Object.keys(each).forEach(function(key)  {
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
	getXYAccessors:function(props, passThroughProps) {
		var accessor = { xAccessor: null, yAccessor: null };

		React.Children.forEach(props.children, function(child)  {
			if (['ReStock.DataSeries']
					.indexOf(child.props.namespace) > -1) {
				if (child.props) {

					var xAccesor = passThroughProps !== undefined && passThroughProps._stockScale
						? passThroughProps._indexAccessor
						: child.props.xAccessor
					accessor.xAccessor = xAccesor;
					accessor.yAccessor = child.props.yAccessor;
				}
			}
		});
		// yAccessors.push(overlayY);

		return accessor;
	},
	identifyOverlaysToAdd:function(props) {
		var overlaysToAdd = [];
		React.Children.forEach(props.children, function(child)  {
			if (/DataSeries$/.test(child.props.namespace)) {
				React.Children.forEach(child.props.children, function(grandChild)  {
					if (/OverlaySeries$/.test(grandChild.props.namespace)) {
						// var overlay = getOverlayFromList(overlays, grandChild.props.id)
						var key = OverlayUtils.getYAccessorKey(props.id, grandChild.props);
						var overlay = {
							id: grandChild.props.id,
							chartId: props.id,
							key: key,
							yAccessor: function(d)  {return d[key];},
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
	calculateOverlays:function(fullData, overlays) {
		if (Array.isArray(fullData)) {
			overlays
				.filter(function(eachOverlay)  {return eachOverlay.id !== undefined;})
				.forEach(function(overlay)  {
					OverlayUtils.calculateOverlay(fullData, overlay);
				});
		} else {
			Object.keys(fullData)
				.filter(function(key)  {return ['D', 'W', 'M'].indexOf(key) > -1;})
				.forEach(function(key)  {
					overlays
						.filter(function(eachOverlay)  {return eachOverlay.id !== undefined;})
						.forEach(function(overlay)  {
							OverlayUtils.calculateOverlay(fullData[key], overlay);
						});
				})
		}
		// console.log(overlays);
	},
	updateOverlayFirstLast:function(data,
		overlays) {

		// console.log('updateOverlayFirstLast');

		var overlayValues = [];

		overlays
			.forEach(function(eachOverlay, idx)  {
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
	updateScales:function(xyValues, scales, data, width, height) {
		console.log('updateScales');


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

	updateChartDataFor:function(_chartData, data) {
		console.log('updateChartDataFor');
		var scales = _chartData.scales;

		var accessors = _chartData.accessors;

		var overlayValues = this.updateOverlayFirstLast(data, _chartData.overlays)
		_chartData = _chartData.set( { overlayValues: overlayValues } ); // replace everything

		var overlayYAccessors = pluck(keysAsArray(_chartData.overlays), 'yAccessor');


		var xyValues = ScaleUtils.flattenData(data, [accessors.xAccessor], [accessors.yAccessor].concat(overlayYAccessors));

		scales = this.updateScales(
			xyValues
			, scales
			, data
			, _chartData.width
			, _chartData.height);

		_chartData = _chartData.set({ scales: scales });

		var last = Utils.cloneMe(data[data.length - 1]);
		_chartData = _chartData.set({ lastItem: last });

		var first = Utils.cloneMe(data[0]);
		_chartData = _chartData.set({ firstItem: first });
		return _chartData;
	}
};

module.exports = ChartContainerMixin;
