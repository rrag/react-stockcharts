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
	return overlays.map((each) => [each.id, each])
		.filter((eachMap) => eachMap[0] === id)
		.map((eachMap) => eachMap[1])[0];
}


var ChartContainerMixin = {
	getChartDataFor(_props, chartProps, data, fullData, passThroughProps) {
		var scales = this.defineScales(chartProps, data, passThroughProps);

		var accessors = this.getXYAccessors(chartProps, passThroughProps);
		// identify overlays
		var overlaysToAdd = this.identifyOverlaysToAdd(chartProps);
		// console.log(overlaysToAdd);
		// calculate overlays
		this.calculateOverlays(fullData, overlaysToAdd);

		var overlayValues = this.updateOverlayFirstLast(data, overlaysToAdd)

		var overlayYAccessors = pluck(keysAsArray(overlaysToAdd), 'yAccessor');

		var availableWidth = _props._width || this.getAvailableWidth(_props);
		var availableHeight = _props._height || this.getAvailableHeight(_props);

		var width = chartProps.width || availableWidth;
		var height = chartProps.height || availableHeight

		var xyValues = ScaleUtils.flattenData(data, [accessors.xAccessor], [accessors.yAccessor].concat(overlayYAccessors));

		scales = this.updateScales(
			xyValues
			, scales
			, data
			, width
			, height);

		var last = Utils.cloneMe(data[data.length - 1]);
		var first = Utils.cloneMe(data[0]);
		var origin = typeof chartProps.origin === 'function'
			? chartProps.origin(availableWidth, availableHeight)
			: chartProps.origin;
		var _chartData = {
				width: width,
				height: height,
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
	identifyOverlaysToAdd(props) {
		var overlaysToAdd = [];
		React.Children.forEach(props.children, (child) => {
			if (/DataSeries$/.test(child.props.namespace)) {
				React.Children.forEach(child.props.children, (grandChild) => {
					if (/OverlaySeries$/.test(grandChild.props.namespace)) {
						// var overlay = getOverlayFromList(overlays, grandChild.props.id)
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
	calculateOverlays(data, overlays) {
		overlays
			.filter((eachOverlay) => eachOverlay.id !== undefined)
			.forEach((overlay) => {
				OverlayUtils.calculateOverlay(data, overlay);
			});
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

	updateChartDataFor(_chartData, data) {
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
