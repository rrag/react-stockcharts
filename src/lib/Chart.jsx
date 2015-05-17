'use strict';

// Overlays have to be calculated here so scales can be modified according to that

var React = require('react/addons'),
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
		data: React.PropTypes.array.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		origin: React.PropTypes.oneOfType([
					React.PropTypes.array
					, React.PropTypes.func
				]).isRequired,
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
	mixins: [React.addons.PureRenderMixin],
	getDefaultProps() {
		return {
			namespace: "ReStock.Chart",
			transformDataAs: "none",
			yDomainUpdate: true,
			origin: [0, 0]
		};
	},
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			if (['ReStock.DataSeries', 'ReStock.ChartOverlay', 'ReStock.XAxis', 'ReStock.YAxis']
				.indexOf(child.props.namespace) < 0) return child;

			var newChild = child;
			newChild = React.addons.cloneWithProps(newChild, {
				_xScale: this.props._chartData.scales.xScale,
				_yScale: this.props._chartData.scales.yScale,
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
				//_lastItem: this.props._chartData.lastItem,
				//_firstItem: this.props._chartData.firstItem,
				/*_currentMouseXY: this.props._currentMouseXY,
				_currentXYValue: this.props._currentXYValue,*/
				_overlays: this.props._chartData.overlays,
				_updateMode: this.props._updateMode,
				_pan: this.props._pan,
				_isMainChart: this.props._isMainChart
			});
		}
		return child;
	},
	render() {
		var height = this.props._height;
		var width = this.props._width;
		var origin = typeof this.props.origin === 'function' ? this.props.origin(width, height) : this.props.origin;
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
