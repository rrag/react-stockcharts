'use strict';

// Overlays have to be calculated here so scales can be modified according to that

var React = require('react/addons'),
	d3 = require('d3'),
	ScaleUtils = require('./utils/scale-utils'),
	OverlayUtils = require('./utils/overlay-utils'),
	Utils = require('./utils/utils');

var pluck = Utils.pluck;
var keysAsArray = Utils.keysAsArray;

var Chart = React.createClass({
	statics: {
		getWidth(props) { return props.width || props._width; },
		getHeight(props) { return props.height || props._height; }
	},
	propTypes: {
		data: React.PropTypes.array.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		_height: React.PropTypes.number,
		_width: React.PropTypes.number,
		_showCurrent: React.PropTypes.bool,
		// if xScale and/or yScale is passed as props
		// the user needs to set 
		// xDomainUpdate=false and yDomainUpdate=false
		// in order for this component to NOT update the scale on change of data
		xScale: React.PropTypes.func,
		yScale: React.PropTypes.func,
		xDomainUpdate: React.PropTypes.bool,
		yDomainUpdate: React.PropTypes.bool,
		_mouseXY: React.PropTypes.array,
		_currentItem: React.PropTypes.object,
		_lastItem: React.PropTypes.object,
		_currentMouseXY: React.PropTypes.array,
		_currentXYValue: React.PropTypes.array
	},
	//mixins: [PureRenderMixin],
	getDefaultProps() {
		return {
			namespace: "ReStock.Chart",
			transformDataAs: "none",
			yDomainUpdate: true
		};
	},
	componentWillMount() {
		var scales = this.defineScales(this.props);
		var xyAccessors = this.getXYAccessors(this.props);

		var newState = this.updateScales(this.props,
					xyAccessors.xAccessors,
					xyAccessors.yAccessors,
					scales.xScale,
					scales.yScale);

		this.setState(newState);
	},
	componentWillReceiveProps(nextProps) {
		// ignoring  _mouseXY, _currentItem, _lastItem

		var scaleRecalculationNeeded = (Chart.getWidth(this.props) !== Chart.getWidth(nextProps)
			|| Chart.getHeight(this.props) !== Chart.getHeight(nextProps)
			|| this.props.xScale !== nextProps.xScale
			|| this.props.yScale !== nextProps.yScale
			|| this.props.xDomainUpdate !== nextProps.xDomainUpdate
			|| this.props.yDomainUpdate !== nextProps.yDomainUpdate)

		if (this.props.data !== nextProps.data) {
			scaleRecalculationNeeded = true;
		}
		if (this.props._overlays !== nextProps._overlays /* or if the data interval changes */) {
			// TODO
			// if any overlay.toBeRemoved = true then _overlays.splice that one out
			this.calculateOverlays(nextProps.data, nextProps._overlays);
			this.updateOverlayFirstLast(nextProps.data, nextProps._overlays, nextProps._overlayValues, nextProps._updateMode)
			scaleRecalculationNeeded = true;
		}
		if (scaleRecalculationNeeded) {
			var scales = this.defineScales(nextProps, this.state.xScale, this.state.yScale);
			var xyAccessors = this.getXYAccessors(nextProps);

			var newState = this.updateScales(nextProps
				, xyAccessors.xAccessors
				, xyAccessors.yAccessors.concat(pluck(keysAsArray(nextProps._overlays), 'yAccessor'))
				, scales.xScale
				, scales.yScale);

			this.setState(newState);
		};
	},
	calculateOverlays(data, _overlays) {
		/*Object.keys(_overlays)
			.filter((key) => key.indexOf('overlay') > -1)
			.forEach((overlay) => {
				OverlayUtils.calculateOverlay(data, _overlays[overlay]);
			});*/
		_overlays
			.filter((eachOverlay) => eachOverlay.id !== undefined)
			.forEach((overlay) => {
				OverlayUtils.calculateOverlay(data, overlay);
			});
		// console.table(data);
		// console.log(_overlays);
	},
	updateOverlayFirstLast(data,
		_overlays,
		_overlayValues,
		_updateMode) {

		console.log('updateOverlayFirstLast');
		_updateMode = _updateMode.set({ immediate: false });

		_overlays.map((eachOverlay) => eachOverlay.yAccessor)
			.forEach((yAccessor, idx) => {
				var first = OverlayUtils.firstDefined(data, yAccessor);
				// console.log(JSON.stringify(first), Object.keys(first), yAccessor(first));
				_overlayValues = _overlayValues.set(idx, {
					first: OverlayUtils.firstDefined(data, yAccessor),
					last: OverlayUtils.lastDefined(data, yAccessor)
				})/**/
			})
		// console.log(_overlayValues);
		_updateMode = _updateMode.set({ immediate: true });
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
		var yAccessors = [], xAccessors = [];

		React.Children.forEach(props.children, (child) => {
			if (['ReStock.DataSeries']
					.indexOf(child.props.namespace) > -1) {
				if (child.props) {
					var xAccesor = child.props.xAccessor || props._indexAccessor
					yAccessors.push(child.props.yAccessor);
					xAccessors.push(xAccesor);
				}
			}
		})
		// yAccessors.push(overlayY);

		return { xAccessors: xAccessors, yAccessors: yAccessors };
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
				_xScale: this.state.xScale,
				_yScale: this.state.yScale,
				data: this.props.data,
				_xAccessor: this.props._indexAccessor
			});
			newChild = this.updatePropsForDataSeries(newChild);
			if (newChild.props.xAccessor !== undefined && this.props._polyLinear) {
				console.warn('xAccessor defined in DataSeries will override the indexAccessor of the polylinear scale. This might not be the right configuration');
				console.warn('Either remove the xAccessor configuration on the DataSeries or change the polyLinear=false in Translate');
			}
			return newChild;
		}, this);
	},
	updatePropsForDataSeries(child) {
		if ("ReStock.DataSeries" === child.props.namespace) {
			return React.addons.cloneWithProps(child, {
				_showCurrent: this.props._showCurrent,
				_mouseXY: this.props._mouseXY,
				_currentItem: this.props._currentItem,
				_lastItem: this.props._lastItem,
				_firstItem: this.props._firstItem,
				_currentMouseXY: this.props._currentMouseXY,
				_currentXYValue: this.props._currentXYValue,
				_overlays: this.props._overlays
			});
		}
		return child;
	},
	render() {
		return (
			<g>{this.renderChildren()}</g>
		);
	}
});

module.exports = Chart;
