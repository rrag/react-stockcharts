'use strict';
var React = require('react'),
	d3 = require('d3');

class CompareSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getPath = this.getPath.bind(this);
	}
	getPath() {
		var dataSeries = d3.svg.line()
			.defined((d, i) =>(this.context.yAccessor(d) !== undefined))
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(d.compare['compare_' + this.props.id]));
		return dataSeries(this.context.plotData);
	}
	render() {
		var className = this.props.className.concat((this.context.stroke !== undefined) ? '' : ' line-stroke');
		// console.log('%s, %s, %s', className, this.props.className, this.props.stroke);
		return (
			<path d={this.getPath()} stroke={this.context.stroke} fill="none" className={className}/>
		);
	}
};

CompareSeries.propTypes = {
	className: React.PropTypes.string,
	id: React.PropTypes.number.isRequired,
};
CompareSeries.defaultProps = {
	namespace: "ReStock.CompareSeries",
	className: "line "
};
CompareSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	stroke: React.PropTypes.string
};

module.exports = CompareSeries;
