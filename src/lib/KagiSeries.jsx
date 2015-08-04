"use strict";

import React from "react";
import d3 from "d3";

class KagiSeries extends React.Component {
	constructor(props) {
		super(props);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.context.type !== "svg") this.drawOnCanvas();
	}
	drawOnCanvas() {
		var ctx = this.context.canvasContext;
		var { stroke, fill } = this.props;
	}
	render() {
		if (this.context.type !== "svg") return null;
		var kagiLine = [];
		var kagi = {};
		for (let i = 0; i < this.context.plotData.length; i++) {
			var d = this.context.plotData[i];
			if (d.close === undefined) continue;
			if (kagi.type === undefined) kagi.type = d.startAs;
			if (kagi.plot === undefined) kagi.plot = [];
			var idx = this.context.xAccessor(d);
			kagi.plot.push([idx, d.open]);

			if (d.changePoint !== undefined) {
				kagi.plot.push([idx, d.changePoint]);
				kagiLine.push(kagi);
				kagi = {
					type: d.changeTo
					, plot: []
				};
				kagi.plot.push([idx, d.changePoint]);
			}
		}
		var { stroke, fill, strokeWidth } = this.props;
		var paths = kagiLine.map((each, i) => {
			var dataSeries = d3.svg.line()
				.x((item) => this.context.xScale(item[0]))
				.y((item) => this.context.yScale(item[1]))
				.interpolate("step-before");
			return (<path key={i} d={dataSeries(each.plot)} className={each.type}
				stroke={stroke[each.type]} fill={fill[each.type]} strokeWidth={strokeWidth} />);
		});
		return (
			<g className={this.props.className}>
				{paths}
			</g>
		);
	}
}

KagiSeries.defaultProps = {
	namespace: "ReStock.KagiSeries",
	className: "react-stockcharts-kagi",
	strokeWidth: 2,
	stroke: {
		yang: "#6BA583",
		yin: "red"
	},
	fill: {
		yang: "none",
		yin: "none"
	},
};

KagiSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	canvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
};

KagiSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

module.exports = KagiSeries;
