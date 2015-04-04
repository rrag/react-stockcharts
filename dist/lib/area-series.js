'use strict';
var React = require('react'),
	d3 = require('d3'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin');

var AreaSeries = React.createClass({displayName: "AreaSeries",
	mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		data: React.PropTypes.array.isRequired
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.AreaSeries"
		}
	},
	getPath:function() {
		var props = this.props;
		var dataSeries = d3.svg.line()
			.defined(function(d, i) {
					return (props._yAccessor(d) !== undefined);
					//nreturn false;
				})
			.x(function(d) { return props._xScale(props._xAccessor(d)); })
			.y(function(d) { return props._yScale(props._yAccessor(d)); });
		return dataSeries(props.data);
	},
	getArea:function() {
		var props = this.props, height = props._yScale.range()[0];
		var areaSeries = d3.svg.area()
			.defined(function(d, i) {
					return (props._yAccessor(d) !== undefined);
					// return false;
				})
			.x(function(d) { return props._xScale(props._xAccessor(d)); })
			.y0(height - 1)
			.y1(function(d) { return props._yScale(props._yAccessor(d)); });

		return areaSeries(props.data);
	},
	render:function() {
		return (
			React.createElement("g", null, 
				React.createElement("path", {d: this.getPath(), className: "line line-stroke"}), 
				React.createElement("path", {d: this.getArea(), className: "area"})
			)
		);
	}
});

module.exports = AreaSeries;

/*				

*/