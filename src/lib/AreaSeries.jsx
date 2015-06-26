"use strict";

import React from "react";
import d3 from "d3";

class AreaSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getPath = this.getPath.bind(this);
		this.getArea = this.getArea.bind(this);
	}
	getPath() {
		var dataSeries = d3.svg.line()
			.defined((d) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y((d) => this.context.yScale(this.context.yAccessor(d)));

		return dataSeries(this.context.plotData);
	}
	getArea() {
		var height = this.context.yScale.range()[0];
		var areaSeries = d3.svg.area()
			.defined((d) => this.context.yAccessor(d) !== undefined)
			.x((d) => this.context.xScale(this.context.xAccessor(d)))
			.y0(height - 1)
			.y1((d) => this.context.yScale(this.context.yAccessor(d)));

		return areaSeries(this.context.plotData);
	}
	render() {
		return (
			<g>
				<path d={this.getPath()} className="line line-stroke" />
				<path d={this.getArea()} className="area" />
			</g>
		);
	}
}

AreaSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
};

AreaSeries.defaultProps = { namespace: "ReStock.AreaSeries" };

module.exports = AreaSeries;
