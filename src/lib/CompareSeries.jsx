"use strict";

import React from "react";
import d3 from "d3";

class CompareSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getPath = this.getPath.bind(this);
	}
	getPath() {
		var dataSeries = d3.svg.line()
			.defined((d) =>(d.compare["compare_" + this.props.id] !== undefined))
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(d.compare["compare_" + this.props.id]));
		return dataSeries(this.context.plotData);
	}
	render() {
		var thisSeries = this.context.compareSeries.filter(each => each.id === this.props.id)[0];

		return (
			<path d={this.getPath()} stroke={thisSeries.stroke} fill="none" className={this.props.className}/>
		);
	}
}

CompareSeries.propTypes = {
	className: React.PropTypes.string,
	stroke: React.PropTypes.string,
	displayLabel: React.PropTypes.string.isRequired,
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
	plotData: React.PropTypes.array.isRequired,
	compareSeries: React.PropTypes.array.isRequired,
};

module.exports = CompareSeries;
