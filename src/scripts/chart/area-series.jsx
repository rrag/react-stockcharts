'use strict';
var React = require('react')
	, d3 = require('d3');

var AreaSeries = React.createClass({

	getPath() {
		var props = this.props;
		var dataSeries = d3.svg.line()
			.defined(function(d, i) {
					return (d.close !== undefined);
					//nreturn false;
				})
			.x(function(d) { return props.xScale(props.xAccesor(d)); })
			.y(function(d) { return props.yScale(props.yAccesor(d)); });

		return dataSeries(props.data);
	},
	getArea() {
		var props = this.props;
		var areaSeries = d3.svg.area()
			.defined(function(d, i) {
					return (props.yAccesor(d) !== undefined);
					// return false;
				})
			.x(function(d) { return props.xScale(props.xAccesor(d)); })
			.y0(props.height - 1)
			.y1(function(d) { return props.yScale(props.yAccesor(d)); });

		return areaSeries(props.data);
	},
	render() {
		return (
			<g>
				<path d={this.getArea()} className="area" />
				<path d={this.getPath()} className="line line-stroke" />
			</g>
		);
	}
});

module.exports = AreaSeries;
