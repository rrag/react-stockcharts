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
	getChartDataFor(chartComponent, _chartData, data, fullData, passThroughProps) {
		var props = chartComponent.props;

		var scales = this.defineScales(props, data);

		var accessors = this.getXYAccessors(props, passThroughProps);
		// identify overlays
		var overlaysToAdd = this.identifyOverlaysToAdd(props, _chartData.overlays);
		_chartData = _chartData.set({ overlays: overlaysToAdd });
		// console.log(overlaysToAdd);
		// calculate overlays
		this.calculateOverlays(fullData, _chartData.overlays);

		var overlayValues = this.updateOverlayFirstLast(data, _chartData.overlays)
		_chartData = _chartData.set( { overlayValues: overlayValues } ); // replace everything

		var overlayYAccessors = pluck(keysAsArray(_chartData.overlays), 'yAccessor');

		_chartData = _chartData.set({
				width: props.width || this.props._width || this.getAvailableWidth(),
				height: props.height || this.props._height || this.getAvailableHeight()
			})

		scales = this.updateScales(
			[accessors.xAccessor]
			, [accessors.yAccessor].concat(overlayYAccessors)
			, scales.xScale
			, scales.yScale
			, data
			, _chartData.width
			, _chartData.height
			, true, true);

		_chartData = _chartData.set({ accessors: accessors });
		_chartData = _chartData.set({ scales: scales });

		var last = Utils.cloneMe(data[data.length - 1]);
		_chartData = _chartData.set({ lastItem: last });

		var first = Utils.cloneMe(data[0]);
		_chartData = _chartData.set({ firstItem: first });
		return _chartData;
	},
	defineScales(props, data, xScaleFromState, yScaleFromState) {
		var xScale = props.xScale || xScaleFromState || props._xScale,
			yScale = props.yScale || yScaleFromState;

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
	identifyOverlaysToAdd(props, overlays) {
		var overlaysToAdd = [];
		React.Children.forEach(props.children, (child) => {
			if (/DataSeries$/.test(child.props.namespace)) {
				React.Children.forEach(child.props.children, (grandChild) => {
					if (/OverlaySeries$/.test(grandChild.props.namespace)) {
						var overlay = getOverlayFromList(overlays, grandChild.props.id)
						var yAccessor = OverlayUtils.getYAccessor(grandChild.props);
						if (overlay === undefined) {
							overlay = {
								id: grandChild.props.id,
								yAccessor: yAccessor,
								options: grandChild.props.options,
								type: grandChild.props.type,
								tooltipLabel: OverlayUtils.getToolTipLabel(grandChild.props),
								stroke: grandChild.stroke || overlayColors(grandChild.props.id)
							};
							overlaysToAdd.push(overlay);
						}
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

		console.log('updateOverlayFirstLast');

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
	updateScales(xAccessors, yAccessors, xScale, yScale, data, width, height, xDomainUpdate, yDomainUpdate) {
		console.log('updateScales');

		var result = ScaleUtils.flattenData(data, xAccessors, yAccessors);

		if (xDomainUpdate) {
			xScale.range([0, width]);
			// if polylinear scale then set data
			xScale = this.updateXScaleDomain(xScale, d3.extent(result.xValues), data)
		}

		if (yDomainUpdate) {
			yScale.range([height, 0]);
			var domain = d3.extent(result.yValues);
			//var extraPadding = Math.abs(domain[0] - domain[1]) * 0.05;
			//yScale.domain([domain[0] - extraPadding, domain[1] + extraPadding]);
			yScale.domain(domain);
		}
		return {
			xScale: xScale,
			yScale: yScale.copy()
		};
	},
	updateXScaleDomain(xScale, domain, data) {
		if (xScale.isPolyLinear && xScale.isPolyLinear()) {
			xScale.data(data);
		} else {
			// else set the domain
			xScale.domain(domain);
		}
		return xScale.copy();
	},

	updateChartDataFor(_chartData, data) {
		var scales = _chartData.scales;

		var accessors = _chartData.accessors;

		var overlayValues = this.updateOverlayFirstLast(data, _chartData.overlays)
		_chartData = _chartData.set( { overlayValues: overlayValues } ); // replace everything

		var overlayYAccessors = pluck(keysAsArray(_chartData.overlays), 'yAccessor');

		scales = this.updateScales(
			[accessors.xAccessor]
			, [accessors.yAccessor].concat(overlayYAccessors)
			, scales.xScale
			, scales.yScale
			, data
			, _chartData.width
			, _chartData.height
			, true, true);

		_chartData = _chartData.set({ scales: scales });

		var last = Utils.cloneMe(data[data.length - 1]);
		_chartData = _chartData.set({ lastItem: last });

		var first = Utils.cloneMe(data[0]);
		_chartData = _chartData.set({ firstItem: first });
		return _chartData;
	}
};

module.exports = ChartContainerMixin;
