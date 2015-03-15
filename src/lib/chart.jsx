'use strict';

// Overlays have to be calculated here so scales can be modified according to that

var React = require('react/addons'),
	d3 = require('d3'),
	ScaleUtils = require('./utils/scale-utils'),
	OverlayUtils = require('./utils/overlay-utils'),
	Utils = require('./utils/utils'),
	overlayColors = Utils.overlayColors;
	// logger = require('./utils/logger')

var pluck = Utils.pluck;
var keysAsArray = Utils.keysAsArray;

function getOverlayFromList(overlays, id) {
	return overlays.map((each) => [each.id, each])
		.filter((eachMap) => eachMap[0] === id)
		.map((eachMap) => eachMap[1])[0];
}

var Chart = React.createClass({
	statics: {
		getWidth(props) { return props.width || props._width; },
		getHeight(props) { return props.height || props._height; }
	},
	propTypes: {
		data: React.PropTypes.array.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		id: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number,
		_width: React.PropTypes.number,
		// _showCurrent: React.PropTypes.bool,
		// if xScale and/or yScale is passed as props
		// the user needs to set 
		// xDomainUpdate=false and yDomainUpdate=false
		// in order for this component to NOT update the scale on change of data
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		xDomainUpdate: React.PropTypes.bool,
		yDomainUpdate: React.PropTypes.bool,
		// _mouseXY: React.PropTypes.array,
		_chartData: React.PropTypes.object.isRequired,
		_updateMode: React.PropTypes.object.isRequired
		/*,
		_currentItem: React.PropTypes.object,
		_lastItem: React.PropTypes.object,
		_currentMouseXY: React.PropTypes.array,
		_currentXYValue: React.PropTypes.array*/
	},
	//mixins: [PureRenderMixin],
	getDefaultProps() {
		return {
			namespace: "ReStock.Chart",
			transformDataAs: "none",
			yDomainUpdate: true
		};
	},
	identifyOverlaysToAdd(props) {
		var overlaysToAdd = [];
		React.Children.forEach(props.children, (child) => {
			if (/DataSeries$/.test(child.props.namespace)) {
				React.Children.forEach(child.props.children, (grandChild) => {
					if (/OverlaySeries$/.test(grandChild.props.namespace)) {
						var overlay = getOverlayFromList(props._chartData.overlays, grandChild.props.id)
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
	componentWillMount() {
		var _chartData = this.props._chartData;

		var scales = this.defineScales(this.props);
		var accessors = this.getXYAccessors(this.props);
		// identify overlays
		var overlaysToAdd = this.identifyOverlaysToAdd(this.props);
		_chartData = _chartData.set({ overlays: overlaysToAdd });
		// console.log(overlaysToAdd);
		// calculate overlays
		this.calculateOverlays(this.props.fullData, _chartData.overlays);

		var overlayValues = this.updateOverlayFirstLast(this.props.data, _chartData.overlays)
		_chartData = _chartData.set( { overlayValues: overlayValues } ); // replace everything

		var overlayYAccessors = pluck(keysAsArray(_chartData.overlays), 'yAccessor');

		scales = this.updateScales(this.props
			, [accessors.xAccessor]
			, [accessors.yAccessor].concat(overlayYAccessors)
			, scales.xScale
			, scales.yScale);

		_chartData = _chartData.set({ accessors: accessors });
		_chartData = _chartData.set({ scales: scales });

		var last = Utils.cloneMe(this.props.data[this.props.data.length - 1]);
		_chartData = _chartData.set({ lastItem: last });

		var first = Utils.cloneMe(this.props.data[0]);
		_chartData = _chartData.set({ firstItem: first });

		this.setState({ chartData: _chartData });
	},
	componentWillReceiveProps(nextProps) {
		// ignoring  _mouseXY, _currentItem, _lastItem

		var scaleRecalculationNeeded = (Chart.getWidth(this.props) !== Chart.getWidth(nextProps)
			|| Chart.getHeight(this.props) !== Chart.getHeight(nextProps)
			|| this.props.xScale !== nextProps.xScale
			|| this.props.yScale !== nextProps.yScale
			|| this.props.xDomainUpdate !== nextProps.xDomainUpdate
			|| this.props.yDomainUpdate !== nextProps.yDomainUpdate)

		var _updateMode = nextProps._updateMode;
		var _chartData = nextProps._chartData;
		var overlaysToAdd = this.identifyOverlaysToAdd(nextProps);

		var overlays = _chartData.overlays;
		if (overlaysToAdd.length > 0)
			overlays = overlays.push(overlaysToAdd);

		if (this.props.data !== nextProps.data) {
			scaleRecalculationNeeded = true;
		}
		// console.log(this.props._chartData.overlays !== nextProps._chartData.overlays);
		if (this.state.chartData.overlays !== overlays /* or if the data interval changes */) {
			// TODO
			// if any overlay.toBeRemoved = true then overlays.splice that one out
			this.calculateOverlays(nextProps.fullData, overlays);

			_updateMode = _updateMode.set({ immediate: false });


			scaleRecalculationNeeded = true;
		}
		if (scaleRecalculationNeeded) {
			var scales = this.defineScales(nextProps, this.state.chartData.scales.xScale, this.state.chartData.scales.yScale);
			var xyAccessors = this.getXYAccessors(nextProps);

			_updateMode = _updateMode.set({ immediate: false });
			var overlayYAccessors = pluck(keysAsArray(overlays), 'yAccessor');


			var overlayValues = this.updateOverlayFirstLast(nextProps.data, _chartData.overlays)
			_chartData = _chartData.set( { overlayValues: overlayValues } ); // replace everything

			// console.log(xyAccessors, overlayYAccessors);

			scales = this.updateScales(nextProps
				, [xyAccessors.xAccessor]
				, [xyAccessors.yAccessor].concat(overlayYAccessors)
				, scales.xScale
				, scales.yScale);

			_chartData = _chartData.set({ accessors: xyAccessors });
			_chartData = _chartData.set({ scales: scales });

			var last = Utils.cloneMe(nextProps.data[nextProps.data.length - 1]);
			_chartData = _chartData.set({ lastItem: last });

			var first = Utils.cloneMe(nextProps.data[0]);
			_chartData = _chartData.set({ firstItem: first });

			this.setState({ chartData: _chartData });
		} else {
			this.setState({ chartData: nextProps._chartData });
		}
	},
	calculateOverlays(data, overlays) {
		/*Object.keys(overlays)
			.filter((key) => key.indexOf('overlay') > -1)
			.forEach((overlay) => {
				OverlayUtils.calculateOverlay(data, overlays[overlay]);
			});*/
		overlays
			.filter((eachOverlay) => eachOverlay.id !== undefined)
			.forEach((overlay) => {
				OverlayUtils.calculateOverlay(data, overlay);
			});
		// console.table(data);
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
	defineScales(props, xScaleFromState, yScaleFromState) {
		var xScale = props.xScale || xScaleFromState || props._xScale,
			yScale = props.yScale || yScaleFromState;

		if (xScale === undefined) {
			var each = props.data[0];
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
	getXYAccessors(props) {
		var accessor = { xAccessor: null, yAccessor: null };

		React.Children.forEach(props.children, (child) => {
			if (['ReStock.DataSeries']
					.indexOf(child.props.namespace) > -1) {
				if (child.props) {
					var xAccesor = props._stockScale ? props._indexAccessor : child.props.xAccessor
					accessor.xAccessor = xAccesor;
					accessor.yAccessor = child.props.yAccessor;
				}
			}
		});
		// yAccessors.push(overlayY);

		return accessor;
	},
	updateScales(props, xAccessors, yAccessors, xScale, yScale) {
		console.log('updateScales');

		var result = ScaleUtils.flattenData(props.data, xAccessors, yAccessors);

		if (props.xScale === undefined || props.xDomainUpdate) {
			xScale.range([0, Chart.getWidth(props)]);
			// if polylinear scale then set data
			if (xScale.data !== undefined) {
				xScale.data(props.data);
			} else {
				// else set the domain
				xScale.domain(d3.extent(result.xValues));
			}
		}

		if (props.yScale === undefined || props.yDomainUpdate) {
			yScale.range([Chart.getHeight(props), 0]);
			var domain = d3.extent(result.yValues);
			//var extraPadding = Math.abs(domain[0] - domain[1]) * 0.05;
			//yScale.domain([domain[0] - extraPadding, domain[1] + extraPadding]);
			yScale.domain(domain);
		}
		return {
			xScale: xScale.copy(),
			yScale: yScale.copy()
		};
	},
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			if (['ReStock.DataSeries', 'ReStock.ChartOverlay', 'ReStock.XAxis', 'ReStock.YAxis']
				.indexOf(child.props.namespace) < 0) return child;

			var newChild = child;
			newChild = React.addons.cloneWithProps(newChild, {
				_xScale: this.state.chartData.scales.xScale,
				_yScale: this.state.chartData.scales.yScale,
				data: this.props.data,
				_xAccessor: this.props._indexAccessor
			});
			newChild = this.updatePropsForDataSeries(newChild);
			if (newChild.props.xAccessor !== undefined && this.props._stockScale) {
				console.warn('xAccessor defined in DataSeries will override the indexAccessor of the polylinear scale. This might not be the right configuration');
				console.warn('Either remove the xAccessor configuration on the DataSeries or change the polyLinear=false in Translate');
			}
			return newChild;
		}, this);
	},
	updatePropsForDataSeries(child) {
		if ("ReStock.DataSeries" === child.props.namespace) {
			// console.log(this.state.chartData.overlays);
			return React.addons.cloneWithProps(child, {
				//_showCurrent: this.props._showCurrent,
				//_mouseXY: this.props._mouseXY,
				//_currentItem: this.state.chartData.currentItem,
				_lastItem: this.state.chartData.lastItem,
				_firstItem: this.state.chartData.firstItem,
				/*_currentMouseXY: this.props._currentMouseXY,
				_currentXYValue: this.props._currentXYValue,*/
				_overlays: this.state.chartData.overlays,
				_updateMode: this.props._updateMode
			});
		}
		return child;
	},
	render() {
		// console.log(this.props._chartData.overlays);
		return (
			<g>{this.renderChildren()}</g>
		);
	}
});

module.exports = Chart;
