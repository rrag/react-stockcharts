"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import wrap from "./wrap";

import { isDefined, isNotDefined } from "../utils";

class KagiSeries extends Component {
	render() {
		var { className, stroke, fill, strokeWidth } = this.props;
		var { xAccessor, xScale, yScale, plotData } = this.props;

		var paths = KagiSeries.helper(plotData, xAccessor).map((each, i) => {
			var dataSeries = d3.svg.line()
				.x((item) => xScale(item[0]))
				.y((item) => yScale(item[1]))
				.interpolate("step-before");
			return (<path key={i} d={dataSeries(each.plot)} className={each.type}
				stroke={stroke[each.type]} fill={fill[each.type]} strokeWidth={strokeWidth} />);
		});
		return (
			<g className={className}>
				{paths}
			</g>
		);
	}
}
KagiSeries.propTypes = {
	className: PropTypes.string,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	strokeWidth: PropTypes.number.isRequired,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
};

KagiSeries.defaultProps = {
	className: "react-stockcharts-kagi",
	strokeWidth: 2,
	stroke: {
		yang: "#6BA583",
		yin: "#E60000"
	},
	fill: {
		yang: "none",
		yin: "none"
	},
	currentValueStroke: "#000000",
};

KagiSeries.yAccessor = (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close });

KagiSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, stroke, strokeWidth, currentValueStroke } = props;
	var begin = true;

	var paths = KagiSeries.helper(plotData, xAccessor);

	paths.forEach((each) => {
		ctx.strokeStyle = stroke[each.type];
		ctx.lineWidth = strokeWidth;

		ctx.beginPath();
		var prevX;
		each.plot.forEach(d => {
			var [x, y] = [xScale(d[0]), yScale(d[1])];
			if (begin) {
				ctx.moveTo(x, y);
				begin = false;
			} else {
				if (isDefined(prevX)) {
					ctx.lineTo(prevX, y);
				}
				ctx.lineTo(x, y);
			}
			prevX = x;
			// console.log(d);

		});
		ctx.stroke();
	});
	var lastPlot = paths[paths.length - 1].plot;
	var last = lastPlot[lastPlot.length - 1];
	ctx.beginPath();
	// ctx.strokeStyle = "black";
	ctx.lineWidth = 1;

	var [x, y1, y2] = [xScale(last[0]), yScale(last[2]), yScale(last[3])];
	// console.log(last, x, y);
	ctx.moveTo(x, y1);
	ctx.lineTo(x + 10, y1);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = currentValueStroke;
	ctx.moveTo(x - 10, y2);
	ctx.lineTo(x, y2);
	ctx.stroke();
};

KagiSeries.helper = (plotData, xAccessor) => {
	var kagiLine = [];
	var kagi = {};
	var d = plotData[0];
	var idx = xAccessor(d);

	for (let i = 0; i < plotData.length; i++) {
		d = plotData[i];

		if (isNotDefined(d.close)) continue;
		if (isNotDefined(kagi.type)) kagi.type = d.startAs;
		if (isNotDefined(kagi.plot)) kagi.plot = [];

		idx = xAccessor(d);
		kagi.plot.push([idx, d.open]);

		if (isDefined(d.changeTo)) {
			kagi.plot.push([idx, d.changePoint]);
			kagi.added = true;
			kagiLine.push(kagi);

			kagi = {
				type: d.changeTo,
				plot: [],
				added: false,
			};
			kagi.plot.push([idx, d.changePoint]);
		}
	}

	if (!kagi.added) {
		kagi.plot.push([idx, d.close, d.current, d.reverseAt]);
		kagiLine.push(kagi);
	}

	// console.log(d.reverseAt);

	return kagiLine;
};

export default wrap(KagiSeries);
