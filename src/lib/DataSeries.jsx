'use strict';

var React = require('react/addons'),
	Utils = require('./utils/utils'),
	d3 = require('d3'),
	OverlayUtils = require('./utils/OverlayUtils'),
	overlayColors = Utils.overlayColors;

function getOverlayFromList(overlays, id) {
	return overlays.map((each) => [each.id, each])
		.filter((eachMap) => eachMap[0] === id)
		.map((eachMap) => eachMap[1])[0];
}

var DataSeries = React.createClass({
	propTypes: {
		xAccessor: React.PropTypes.func,
		_xAccessor: React.PropTypes.func,
		yAccessor: React.PropTypes.func.isRequired,

		_xScale: React.PropTypes.func,
		_yScale: React.PropTypes.func,

		/*_currentItem: React.PropTypes.object,
		_lastItem: React.PropTypes.object,
		_firstItem: React.PropTypes.object,*/
		_overlays: React.PropTypes.array,
		_updateMode: React.PropTypes.object
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.DataSeries"
		};
	},
	renderChildren() {
		var newChildren = React.Children.map(this.props.children, (child) => {
			var newChild = child;

			if (typeof child.type === 'string') return newChild;

			if (/Series$/.test(newChild.props.namespace)) {
				newChild = React.cloneElement(newChild, {
					_xScale: this.props._xScale,
					_yScale: this.props._yScale,
					_xAccessor: (this.props.xAccessor || this.props._xAccessor),
					_yAccessor: this.props.yAccessor,
					data: this.props.data
				});
				if (/OverlaySeries$/.test(newChild.props.namespace)) {
					var key = newChild.props.id;
					var overlay = getOverlayFromList(this.props._overlays, newChild.props.id);
					newChild = React.cloneElement(newChild, {
						_overlay: overlay,
						_pan: this.props._pan,
						_isMainChart: this.props._isMainChart
					});
				}
			}
			return newChild;
		}, this);

		return newChildren;
	},
	render() {
		//throw new Error();
		// console.log('rendering dataseries...');
		/*if (this.props._pan) {
			return <g></g>
		}*/
		return (
			<g  style={{ "clipPath": "url(#chart-area-clip)" }}>{this.renderChildren()}</g>
		);
	}
});

module.exports = DataSeries;
