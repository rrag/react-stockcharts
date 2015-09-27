"use strict";

import React from "react";
import d3 from "d3";

import wrap from "./wrap";

const KagiSeries = (props) => {
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
};

KagiSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

KagiSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke, fill, strokeWidth } = props;
	var begin = true;

	var paths = KagiSeries.helper(plotData, xAccessor)
		.forEach((each, i) => {
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
			// console.log(d, idx);
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
		kagiLine.push(kagi);
	}

	return kagiLine;
};

export default wrap(KagiSeries);
