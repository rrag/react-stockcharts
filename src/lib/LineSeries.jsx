'use strict';
var React = require('react'),
	d3 = require('d3');


var LineSeries = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
	},
	contextTypes: {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		_data: React.PropTypes.array.isRequired,
		stroke: React.PropTypes.string
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.LineSeries",
			className: "line "
		}
	},
	getPath() {
		var dataSeries = d3.svg.line()
			.defined((d, i) =>(this.context.yAccessor(d) !== undefined))
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(this.context.yAccessor(d)));
		return dataSeries(this.context._data);
	},
	render() {
		var className = this.props.className.concat((this.context.stroke !== undefined) ? '' : ' line-stroke');
		// console.log('%s, %s, %s', className, this.props.className, this.props.stroke);
		return (
			<path d={this.getPath()} stroke={this.context.stroke} fill="none" className={className}/>
		);
	}
});

module.exports = LineSeries;
