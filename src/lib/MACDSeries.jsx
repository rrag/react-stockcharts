'use strict';
var React = require('react'),
	d3 = require('d3');

class MACDSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getMACDLine = this.getMACDLine.bind(this);
		this.getSignalLine = this.getSignalLine.bind(this);
		this.getHistogram = this.getHistogram.bind(this);
	}
	getMACDLine() {
		var dataSeries = d3.svg.line()
			.defined((d, i) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(this.context.yAccessor(d).MACDLine));

		return dataSeries(this.context.plotData);
	}
	getSignalLine() {
		var dataSeries = d3.svg.line()
			.defined((d, i) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(this.context.yAccessor(d).signalLine));

		return dataSeries(this.context.plotData);
	}
	getHistogram() {
		var dataSeries = d3.svg.line()
			.defined((d, i) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(this.context.yAccessor(d).histogram));

		return dataSeries(this.context.plotData);
	}
	getHorizontalLine() {
		var dataSeries = d3.svg.line()
			.defined((d, i) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(0));

		return dataSeries(this.context.plotData);
	}
	render() {
		return (
			<g>
				<path d={this.getMACDLine()} className="line" stroke="blue" />
				<path d={this.getSignalLine()} className="line" stroke="green" />
				<path d={this.getHistogram()} className="line" stroke="red" />
				<path d={this.getHorizontalLine()} className="line" stroke="black" />
			</g>
		);
	}
};

MACDSeries.contextTypes = {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		plotData: React.PropTypes.array.isRequired,
	};
MACDSeries.defaultProps = { namespace: "ReStock.MACDSeries" };

module.exports = MACDSeries;
