'use strict';
var React = require('react')
	, d3 = require('d3');

var LineSeries = React.createClass({
	propTypes: {
		_xScale: React.PropTypes.func.isRequired,
		_yScale: React.PropTypes.func.isRequired,
		_xAccessor: React.PropTypes.func.isRequired,
		_yAccessor: React.PropTypes.func.isRequired
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.LineSeries"
		}
	},
	getPath() {
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
	render() {
		return (
			<g>
				<path d={this.getPath()} className="line line-stroke" />
			</g>
		);
	}
});

module.exports = LineSeries;

/*				

*/