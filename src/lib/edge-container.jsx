'use strict';
var React = require('react/addons');

var EdgeContainer = React.createClass({
	propTypes: {
		_currentItems: React.PropTypes.array.isRequired,
		_charts: React.PropTypes.array.isRequired,
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.EdgeContainer",
		}
	},/*
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			if (/EdgeIndicator$/.test(newChild.props.namespace)) {
				var chart = this.props._charts.filter((chart) => chart.id === newChild.props.forChart)[0];
				var currentItem = this.props._currentItems.filter((item) => item.id === newChild.props.forChart)[0];

				var item, yAccessor;
				if (newChild.props.forOverlay !== undefined
						&& chart.overlays.length > 0
						&& chart.overlayValues.length > 0) {
					var overlay = chart.overlays
						.filter((eachOverlay) => eachOverlay.id === newChild.props.forOverlay);
					var overlayValue = chart.overlayValues
						.filter((eachOverlayValue) => eachOverlayValue.id === newChild.props.forOverlay);

					// console.log(overlay, overlayValue);

					if (overlay.length !== 1) {
						console.warn('%s overlays found with id %s, correct the OverlaySeries so there is exactly one for each id', overlay.length, newChild.props.forOverlay)
						throw new Error('Unable to identify unique Overlay for the id');
					}
					if (overlayValue.length !== 1 && overlay.length === 1) {
						console.warn('Something is wrong!!!, There should be 1 overlayValue, report the issue on github');
					}

					item = newChild.props.itemType === 'first'
						? overlayValue[0].first
						: newChild.props.itemType === 'last'
							? overlayValue[0].last
							: currentItem;
					yAccessor = overlay[0].yAccessor;

					newChild = this.getNewChild(newChild, item, yAccessor, chart) 
				} else if (newChild.props.forOverlay === undefined) {
					item = newChild.props.itemType === 'first'
						? chart.firstItem
						: newChild.props.itemType === 'last'
							? chart.lastItem
							: currentItem;

					yAccessor = chart.accessors.yAccessor;
					newChild = this.getNewChild(newChild, item, yAccessor, chart) 
				}
			}
			return newChild;
		});
	},
	getNewChild(newChild, item, yAccessor, chart) {
		var yValue = yAccessor(item), xValue = chart.accessors.xAccessor(item);
		var x1 = Math.round(chart.scales.xScale(xValue)), y1 = Math.round(chart.scales.yScale(yValue));

		// console.log(item, yValue, xValue, x1, y1);

		return React.addons.cloneWithProps(newChild, {
			_width: this.props._width,
			_x1: x1,
			_y1: y1,
			_value: yValue
		});
	},*/
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			if (/EdgeIndicator$/.test(newChild.props.namespace)) {
				var chart = this.props._charts.filter((chart) => chart.id === newChild.props.forChart)[0];
				var currentItem = this.props._currentItems.filter((item) => item.id === newChild.props.forChart)[0];
				newChild = React.addons.cloneWithProps(newChild, {
					_width: this.props._width,
					_chart: chart,
					_currentItem: currentItem
				});
			}
			return newChild;
		});
	},
	render() {
		return <g>{this.renderChildren()}</g>
	}
});

module.exports = EdgeContainer;


/*
this.props._overlays.length > 0 && this.props._overlayValues.length > 0
*/