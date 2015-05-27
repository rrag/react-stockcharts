'use strict';
var React = require('react'),
	d3 = require('d3');

var AreaSeries = React.createClass({
	getDefaultProps() {
		return {
			namespace: "ReStock.AreaSeries"
		}
	},
	contextTypes: {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		_data: React.PropTypes.array.isRequired,
	},
	getPath() {
		var dataSeries = d3.svg.line()
			.defined((d, i) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(this.context.yAccessor(d)));
		return dataSeries(this.context._data);
	},
	getArea() {
		var height = this.context.yScale.range()[0];
		var areaSeries = d3.svg.area()
			.defined((d, i) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y0(height - 1)
			.y1((d) => this.context.yScale(this.context.yAccessor(d)));

		return areaSeries(this.context._data);
	},
	render() {
		return (
			<g>
				<path d={this.getPath()} className="line line-stroke" />
				<path d={this.getArea()} className="area" />
			</g>
		);
	}
});

module.exports = AreaSeries;
