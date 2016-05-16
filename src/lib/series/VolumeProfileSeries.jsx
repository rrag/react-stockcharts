"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import wrap from "./wrap";

import { head, last } from "../utils";

var rollup = d3.nest()
	.key(d => d.direction)
	.sortKeys(d3.descending)
	.rollup(leaves => d3.sum(leaves, d => d.volume))

class VolumeProfileSeries extends Component {
	render() {
		var { className, yScale, xAccessor, yAccessor, plotData, stroke, type, width } = this.props;
		var { bins, maxProfileWidthPercent, source, volume, absoluteChange, baseAt, fill, stroke, opacity } = this.props;

		var histogram = d3.layout.histogram()
			.value(source)
			.bins(bins);

		var values = histogram(plotData)
		var volumeInBins = values
			.map(arr => arr.map(d => absoluteChange(d) > 0 ? { direction: "up", volume: volume(d) } : { direction: "down", volume: volume(d) }))
			.map(arr => rollup.entries(arr));

		var volumeValues = volumeInBins
			.map(each => d3.sum(each.map(d => d.values)))

		var pick = baseAt === "left" ? head : last;
		var base = xScale => pick(xScale.range());

		var start = baseAt === "left" ? 0 : width * (100 - maxProfileWidthPercent) / 100;
		var end = baseAt === "left" ? width * maxProfileWidthPercent / 100 : width;

		var xScale = d3.scale.linear()
			.domain([0, d3.max(volumeValues)])
			.range([start, end])

		var rects = d3.zip(values, volumeInBins)
			.map(([d, volumes]) => {
				var totalVolume = d3.sum(volumes, d => d.values);
				var totalVolumeX = xScale(totalVolume);
				var width = base(xScale) - totalVolumeX;

				var x = width < 0 ? totalVolumeX + width : totalVolumeX;
				var ws = volumes.map(d => {
					return {
						type: d.key,
						width: d.values * Math.abs(width) / totalVolume,
					}
				});
				var w1 = ws[0] || { type: "up", width: 0 };
				var w2 = ws[1] || { type: "down", width: 0 };

				// console.log(width, ws.map(d => d.type))

				return {
					y: yScale(d.x + d.dx),
					height: yScale(d.x - d.dx) - yScale(d.x),
					x,
					width,
					w1: w1.width,
					w2: w2.width,
					type1: w1.type,
					type2: w2.type,
				};
			})

		return <g>
			{rects.map((d, i) => <g key={i}>
					<rect x={d.x} width={d.w1} y={d.y} height={d.height} fill={fill(d.type1)} stroke={stroke} opacity={opacity}/>
					<rect x={d.x + d.w1} width={d.w2} y={d.y} height={d.height} fill={fill(d.type2)} stroke={stroke} opacity={opacity}/>
				</g>)}
		</g>;
	}
}


/*
					<rect x={d.x} width={d.width} y={d.y} height={d.height} fill="none" stroke="#000000"/>


*/

VolumeProfileSeries.propTypes = {
	className: PropTypes.string,
};

VolumeProfileSeries.defaultProps = {
	stroke: "none",
	opacity: 0.3,
	className: "line ",
	bins: 20,
	maxProfileWidthPercent: 30,
	source: d => d.close,
	volume: d => d.volume,
	absoluteChange: d => d.absoluteChange,
	sessionStart: ({ d, i, index, plotData }) => i === 0,
	sessionEnd: ({ d, i, index, plotData }) => i === plotData.length - 1,
	baseAt: "right",
	fill: type =>  type === "up" ? "green" : "red",
};

VolumeProfileSeries.yAccessor = (d) => d.close;

export default wrap(VolumeProfileSeries);
