"use strict";

import React from "react";
import d3 from "d3";

import wrap from "./wrap";

class KagiSeries extends React.Component {
	render() {
		var { props } = this;
		var { className, stroke, fill, strokeWidth } = props;
		var { xAccessor, xScale, yScale, plotData } = props;

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

KagiSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

KagiSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke, fill, strokeWidth, currentValueStroke } = props;
	var begin = true;

	var paths = KagiSeries.helper(plotData, xAccessor);

	paths.forEach((each, i) => {
		ctx.strokeStyle = stroke[each.type];
		ctx.lineWidth = strokeWidth;

		ctx.beginPath();
		var prevX, prevY;
		each.plot.forEach(d => {
			var [x, y] = [xScale(d[0]), yScale(d[1])];
			if (begin) {
				ctx.moveTo(x, y);
				begin = false;
			} else {
				if (prevX !== undefined) {
					ctx.lineTo(prevX, y);
				}
				ctx.lineTo(x, y);
			}
			prevX = x;
			prevY = y;

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
	for (let i = 0; i < plotData.length; i++) {
		var d = plotData[i];
		if (d.close === undefined) continue;
		if (kagi.type === undefined) kagi.type = d.startAs;
		if (kagi.plot === undefined) kagi.plot = [];
		var idx = xAccessor(d);
		kagi.plot.push([idx, d.open]);

		if (d.changeTo !== undefined) {
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
