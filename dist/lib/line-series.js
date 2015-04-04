'use strict';
var React = require('react'),
	d3 = require('d3'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin');


var LineSeries = React.createClass({displayName: "LineSeries",
	// mixins: [PureRenderMixin],
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired,
		data: React.PropTypes.array.isRequired,
		className: React.PropTypes.string,
		stroke: React.PropTypes.string
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.LineSeries",
			className: "line "
		}
	},
	getPath:function() {
		// console.log('LineSeries.getPath');
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
	render:function() {
		var className = this.props.className.concat((this.props.stroke !== undefined) ? '' : ' line-stroke');
		// console.log('%s, %s, %s', className, this.props.className, this.props.stroke);

		return (
			React.createElement("g", null, 
				React.createElement("path", {d: this.getPath(), stroke: this.props.stroke, fill: "none", className: className})
			)
		);
	}
});

module.exports = LineSeries;

/*				

*/