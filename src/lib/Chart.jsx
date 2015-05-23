'use strict';

// Overlays have to be calculated here so scales can be modified according to that

var React = require('react'),
	PureRenderMixin = require('react/addons/PureRenderMixin'),
	d3 = require('d3'),
	ScaleUtils = require('./utils/ScaleUtils'),
	OverlayUtils = require('./utils/OverlayUtils'),
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
		//data: React.PropTypes.array.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		origin: React.PropTypes.oneOfType([
					React.PropTypes.array
					, React.PropTypes.func
				]).isRequired,
		id: React.PropTypes.number.isRequired,
		// _height: React.PropTypes.number,
		// _width: React.PropTypes.number,
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
		// _chartData: React.PropTypes.object.isRequired,
		// _updateMode: React.PropTypes.object.isRequired
		/*,
		_currentItem: React.PropTypes.object,
		_lastItem: React.PropTypes.object,
		_currentMouseXY: React.PropTypes.array,
		_currentXYValue: React.PropTypes.array*/
	},
	mixins: [React.PureRenderMixin],

	contextTypes: {
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired,
		_data: React.PropTypes.array.isRequired,
		_chartData: React.PropTypes.array,
		_updateMode: React.PropTypes.object
	},
	childContextTypes: {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		overlays: React.PropTypes.array.isRequired,
	},
	getChildContext() {
		var chartData = this.context._chartData.filter((each) => each.id === this.props.id)[0];
		console.log(chartData);
		return {
			xScale: chartData.scales.xScale,
			yScale: chartData.scales.yScale,
			xAccessor: chartData.accessors.xAccessor,
			yAccessor: chartData.accessors.yAccessor,
			overlays: chartData.overlays
		}
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.Chart",
			transformDataAs: "none",
			yDomainUpdate: true,
			origin: [0, 0]
		};
	},
	renderChildren() {
		var chartData = this.context._chartData.filter((each) => each.id === this.props.id)[0];
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			if (['ReStock.DataSeries', 'ReStock.ChartOverlay', 'ReStock.XAxis', 'ReStock.YAxis']
				.indexOf(child.props.namespace) < 0) return child;

			var newChild = child;
			newChild = React.cloneElement(newChild, {
				_xScale: chartData.scales.xScale,
				_yScale: chartData.scales.yScale,
				data: this.context._data,
				_xAccessor: this.props._indexAccessor
			});
			newChild = this.updatePropsForDataSeries(newChild, chartData);
			if (newChild.props.xAccessor !== undefined && this.props._stockScale) {
				console.warn('xAccessor defined in DataSeries will override the indexAccessor of the polylinear scale. This might not be the right configuration');
				console.warn('Either remove the xAccessor configuration on the DataSeries or change the polyLinear=false in Translate');
			}
			return newChild;
		}, this);
	},
	updatePropsForDataSeries(child, chartData) {
		if ("ReStock.DataSeries" === child.props.namespace) {
			// console.log(this.state.chartData.overlays);
			return React.cloneElement(child, {
				//_showCurrent: this.props._showCurrent,
				//_mouseXY: this.props._mouseXY,
				//_currentItem: this.state.chartData.currentItem,
				//_lastItem: this.props._chartData.lastItem,
				//_firstItem: this.props._chartData.firstItem,
				/*_currentMouseXY: this.props._currentMouseXY,
				_currentXYValue: this.props._currentXYValue,*/
				_overlays: chartData.overlays,
				_updateMode: this.context._updateMode,
				_pan: this.props._pan,
				_isMainChart: this.props._isMainChart
			});
		}
		return child;
	},
	render() {
		var height = this.context._height;
		var width = this.context._width;
		var origin = typeof this.props.origin === 'function' ? this.props.origin(width, height) : this.props.origin;
		console.log(origin);
		var transform = 'translate(' + origin[0] + ',' +  origin[1] + ')';
		if (this.props._pan && !this.props._isMainChart) {
		// if (this.props._pan) {
			return <g></g>
		}
		// console.log(this.props._chartData);
		return (
			<g transform={transform}>{this.renderChildren()}</g>
		);
	}
});

module.exports = Chart;
