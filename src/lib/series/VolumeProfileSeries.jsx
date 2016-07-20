"use strict";

import React, { PropTypes, Component } from "react";
import d3 from "d3";

import wrap from "./wrap";

import { head, last, hexToRGBA, accumulatingWindow, identity } from "../utils";

class VolumeProfileSeries extends Component {
	render() {
		var { className, opacity, xScale, yScale, plotData } = this.props;
		var { showSessionBackground, sessionBackGround, sessionBackGroundOpacity } = this.props;

		var { rects, sessionBg } = helper(this.props, xScale, yScale, plotData);

		var sessionBgSvg = showSessionBackground
			? sessionBg.map((d, idx) => <rect key={idx} {...d} opacity={sessionBackGroundOpacity} fill={sessionBackGround} />)
			: null;

		return <g className={className}>
			{sessionBgSvg}
			{rects.map((d, i) => <g key={i}>
					<rect x={d.x} y={d.y}
						width={d.w1} height={d.height}
						fill={d.fill1} stroke={d.stroke1} fillOpacity={opacity} />
					<rect x={d.x + d.w1} y={d.y}
						width={d.w2} height={d.height}
						fill={d.fill2} stroke={d.stroke2} fillOpacity={opacity} />
				</g>)}
		</g>;
	}
}

VolumeProfileSeries.propTypes = {
	className: PropTypes.string,
	opacity: PropTypes.number,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
	showSessionBackground: PropTypes.bool,
	sessionBackGround: PropTypes.string,
	sessionBackGroundOpacity: PropTypes.number,
};

VolumeProfileSeries.defaultProps = {
	opacity: 0.5,
	className: "line ",
	bins: 20,
	maxProfileWidthPercent: 50,
	source: d => d.close,
	volume: d => d.volume,
	absoluteChange: d => d.absoluteChange,
	bySession: false,
	/* eslint-disable no-unused-vars */
	sessionStart: ({ d, i, plotData }) => d.idx.startOfMonth,
	/* eslint-enable no-unused-vars */
	orient: "left",
	fill: ({ type }) => type === "up" ? "#6BA583" : "#FF0000",
	// fill: ({ type }) => { var c = type === "up" ? "#6BA583" : "#FF0000"; console.log(type, c); return c },
	// stroke: ({ type }) =>  type === "up" ? "#6BA583" : "#FF0000",
	// stroke: "none",
	stroke: "#FFFFFF",
	showSessionBackground: false,
	sessionBackGround: "#4682B4",
	sessionBackGroundOpacity: 0.3,
	partialStartOK: false,
	partialEndOK: true,
};

function helper(props, realXScale, yScale, plotData) {
	var { xAccessor, width, sessionStart, bySession, partialStartOK, partialEndOK } = props;
	var { bins, maxProfileWidthPercent, source, volume, absoluteChange, orient, fill, stroke } = props;

	var sessionBuilder = accumulatingWindow()
			.discardTillStart(!partialStartOK)
			.discardTillEnd(!partialEndOK)
			.accumulateTill((d, i) => {
				return sessionStart({ d, i, plotData });
			})
			.accumulator(identity);

	var dx = plotData.length > 1 ? realXScale(xAccessor(plotData[1])) - realXScale(xAccessor(head(plotData))) : 0;

	var sessions = bySession ? sessionBuilder(plotData) : [plotData];

	var allRects = sessions.map(session => {

		var begin = bySession ? realXScale(xAccessor(head(session))) : 0;
		var finish = bySession ? realXScale(xAccessor(last(session))) : width;
		var sessionWidth = finish - begin + dx;

		var histogram = d3.layout.histogram()
				.value(source)
				.bins(bins);

		var rollup = d3.nest()
				.key(d => d.direction)
				.sortKeys(orient === "right" ? d3.descending : d3.ascending)
				.rollup(leaves => d3.sum(leaves, d => d.volume));

		var values = histogram(session);
		var volumeInBins = values
				.map(arr => arr.map(d => absoluteChange(d) > 0 ? { direction: "up", volume: volume(d) } : { direction: "down", volume: volume(d) }))
				.map(arr => rollup.entries(arr));

		var volumeValues = volumeInBins
				.map(each => d3.sum(each.map(d => d.values)));

		var base = xScale => head(xScale.range());

		var [start, end] = orient === "right"
				? [begin, begin + sessionWidth * maxProfileWidthPercent / 100]
				: [finish, finish - sessionWidth * (100 - maxProfileWidthPercent) / 100];

		var xScale = d3.scale.linear()
				.domain([0, d3.max(volumeValues)])
				.range([start, end]);

		var totalVolumes = volumeInBins.map(volumes => {

			var totalVolume = d3.sum(volumes, d => d.values);
			var totalVolumeX = xScale(totalVolume);
			var width = base(xScale) - totalVolumeX;
			var x = width < 0 ? totalVolumeX + width : totalVolumeX;

			var ws = volumes.map(d => {
				return {
					type: d.key,
					width: d.values * Math.abs(width) / totalVolume,
				};
			});
			return { x, ws, totalVolumeX };
		});

		var rects = d3.zip(values, totalVolumes)
				.map(([d, { x, ws }]) => {
					var w1 = ws[0] || { type: "up", width: 0 };
					var w2 = ws[1] || { type: "down", width: 0 };

					return {
						y: yScale(d.x + d.dx),
						height: yScale(d.x - d.dx) - yScale(d.x),
						x,
						width,
						w1: w1.width,
						w2: w2.width,
						stroke1: d3.functor(stroke)(w1),
						stroke2: d3.functor(stroke)(w2),
						fill1: d3.functor(fill)(w1),
						fill2: d3.functor(fill)(w2),
					};
				});

		var sessionBg = {
			x: begin,
			y: last(rects).y,
			height: head(rects).y - last(rects).y + head(rects).height,
			width: sessionWidth,
		};

		return { rects, sessionBg };
	});

	return {
		rects: d3.merge(allRects.map(d => d.rects)),
		sessionBg: allRects.map(d => d.sessionBg),
	};
}


VolumeProfileSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { opacity, sessionBackGround, sessionBackGroundOpacity, showSessionBackground } = props;

	var { rects, sessionBg } = helper(props, xScale, yScale, plotData);

	if (showSessionBackground) {
		ctx.fillStyle = hexToRGBA(sessionBackGround, sessionBackGroundOpacity);

		sessionBg.forEach(each => {
			var { x, y, height, width } = each;

			ctx.beginPath();
			ctx.rect(x, y, width, height);
			ctx.closePath();
			ctx.fill();
		});
	}

	rects.forEach(each => {
		var { x, y, height, w1, w2, stroke1, stroke2, fill1, fill2 } = each;


		if (w1 > 0) {
			ctx.fillStyle = hexToRGBA(fill1, opacity);
			if (stroke1 !== "none") ctx.strokeStyle = stroke1;

			ctx.beginPath();
			ctx.rect(x, y, w1, height);
			ctx.closePath();
			ctx.fill();

			if (stroke1 !== "none") ctx.stroke();
		}

		if (w2 > 0) {
			ctx.fillStyle = hexToRGBA(fill2, opacity);
			if (stroke2 !== "none") ctx.strokeStyle = stroke2;

			ctx.beginPath();
			ctx.rect(x + w1, y, w2, height);
			ctx.closePath();
			ctx.fill();

			if (stroke2 !== "none") ctx.stroke();
		}

	});
};

export default wrap(VolumeProfileSeries);
