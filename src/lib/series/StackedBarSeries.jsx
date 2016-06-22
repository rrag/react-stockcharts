"use strict";

import d3 from "d3";
import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

import { identity, hexToRGBA, first, last, isDefined } from "../utils";


class StackedBarSeries extends Component {
	render() {
		return <g className="react-stockcharts-bar-series">
			{svgHelper(this.props, d3.layout.stack())}
		</g>;
	}
}

StackedBarSeries.propTypes = {
	baseAt: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.func,
	]).isRequired,
	direction: PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: PropTypes.bool.isRequired,
	widthRatio: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	fill: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	className: PropTypes.oneOfType([
		PropTypes.func, PropTypes.string
	]).isRequired,
	xAccessor: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.func), PropTypes.func
	]).isRequired,
	yAccessor: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.func), PropTypes.func
	]).isRequired,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	plotData: PropTypes.array,
};

StackedBarSeries.defaultProps = {
	baseAt: (xScale, yScale/* , d*/) => first(yScale.range()),
	direction: "up",
	className: "bar",
	stroke: false,
	fill: "#4682B4",
	opacity: 1,
	widthRatio: 0.5,
};

StackedBarSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {

	var { yAccessor, xAccessor } = props;
	drawOnCanvasHelper(props, ctx, xScale, yScale, plotData, xAccessor, yAccessor, d3.layout.stack());
};

export function drawOnCanvasHelper(props, ctx, xScale, yScale, plotData, xAccessor, yAccessor,
		stackFn, defaultPostAction = identity, postRotateAction = rotateXY) {
	var bars = doStuff(props, plotData, xScale, yScale, stackFn, postRotateAction, defaultPostAction);
	drawOnCanvas2(props, ctx, bars);
}

function convertToArray(item) {
	return Array.isArray(item) ? item : [item];
}

export function svgHelper(props, stackFn, defaultPostAction = identity, postRotateAction = rotateXY) {
	var { xScale, yScale, plotData } = props;
	var bars = doStuff(props, plotData, xScale, yScale, stackFn, postRotateAction, defaultPostAction);

	return getBarsSVG2(props, bars);
}

function doStuff(props, plotData, xScale, yScale, stackFn, postRotateAction, defaultPostAction) {
	var { yAccessor, xAccessor, swapScales } = props;

	var modifiedYAccessor = swapScales ? convertToArray(xAccessor) : convertToArray(yAccessor);
	var modifiedXAccessor = swapScales ? yAccessor : xAccessor;

	var modifiedXScale = swapScales ? yScale : xScale;
	var modifiedYScale = swapScales ? xScale : yScale;

	var postProcessor =  swapScales ? postRotateAction : defaultPostAction;

	var bars = getBars(props, modifiedXAccessor, modifiedYAccessor, modifiedXScale, modifiedYScale, plotData, stackFn, postProcessor);
	return bars;
}

export const rotateXY = (array) => array.map(each => {
	return {
		...each,
		x: each.y,
		y: each.x,
		height: each.width,
		width: each.height
	};
});

export function getBarsSVG2(props, bars) {
	/* eslint-disable react/prop-types */
	var { opacity } = props;
	/* eslint-enable react/prop-types */

	return bars.map((d, idx) => {
		if (d.width <= 1) {
			return <line key={idx} className={d.className}
						stroke={d.fill}
						x1={d.x} y1={d.y}
						x2={d.x} y2={d.y + d.height} />;
		}
		return <rect key={idx} className={d.className}
					stroke={d.stroke}
					fill={d.fill}
					x={d.x}
					y={d.y}
					width={d.width}
					fillOpacity={opacity}
					height={d.height} />;
	});
}

export function drawOnCanvas2(props, ctx, bars) {
	var { stroke } = props;

	var nest = d3.nest()
		.key(d => d.fill)
		.entries(bars);

	nest.forEach(outer => {
		var { key, values } = outer;
		if (values[0].width < 1) {
			ctx.strokeStyle = key;
		} else {
			ctx.strokeStyle = key;
			ctx.fillStyle = hexToRGBA(key, props.opacity);
		}
		values.forEach(d => {
			if (d.width < 1) {
				/* <line key={idx} className={d.className}
							stroke={stroke}
							fill={fill}
							x1={d.x} y1={d.y}
							x2={d.x} y2={d.y + d.height} />*/
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x, d.y + d.height);
				ctx.stroke();
			} else {
				/* <rect key={idx} className={d.className}
						stroke={stroke}
						fill={fill}
						x={d.x}
						y={d.y}
						width={d.width}
						height={d.height} /> */
				ctx.beginPath();
				ctx.rect(d.x, d.y, d.width, d.height);
				ctx.fill();
				if (stroke) ctx.stroke();
			}

		});
	});
}

export function getBars(props, xAccessor, yAccessor, xScale, yScale, plotData, stack = identity, after = identity) {
	var { baseAt, className, fill, stroke, widthRatio, spaceBetweenBar = 0 } = props;

	var getClassName = d3.functor(className);
	var getFill = d3.functor(fill);
	var getBase = d3.functor(baseAt);

	var width = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData))));
	var bw = (width / (plotData.length - 1) * widthRatio);
	var barWidth = Math.round(bw);

	var eachBarWidth = (barWidth - spaceBetweenBar * (yAccessor.length - 1)) / yAccessor.length;

	var offset = (barWidth === 1 ? 0 : 0.5 * barWidth);

	var layers = yAccessor
		.map((eachYAccessor, i) => plotData
			.map(d => ({
				series: xAccessor(d),
				datum: d,
				x: i,
				y: eachYAccessor(d),
				className: getClassName(d, i),
				stroke: stroke ? getFill(d, i) : "none",
				fill: getFill(d, i),
			}))
		);

	var data = stack(layers);

	var bars = d3.merge(data)
			.filter(d => isDefined(d.y))
			.map(d => {
				// let baseValue = yScale.invert(getBase(xScale, yScale, d.datum));
				let y = yScale(d.y + (d.y0 || 0));
				/* let h = isDefined(d.y0) && d.y0 !== 0 && !isNaN(d.y0)
					? yScale(d.y0) - y
					: getBase(xScale, yScale, d.datum) - yScale(d.y)*/
				var h = getBase(xScale, yScale, d.datum) - yScale(d.y);

				// let h = ;
				// if (d.y < 0) h = -h;
				if (h < 0) {
					y = y + h;
					h = -h;
				}
				/* console.log(d.series, d.datum.date, d.x,
					getBase(xScale, yScale, d.datum), `d.y=${d.y}, d.y0=${d.y0}, y=${y}, h=${h}`)*/
				return {
					className: d.className,
					stroke: d.stroke,
					fill: d.fill,
					// series: d.series,
					// i: d.x,
					x: xScale(d.series) - barWidth / 2,
					y: y,
					groupOffset: offset - (d.x > 0 ? (eachBarWidth + spaceBetweenBar) * d.x : 0),
					groupWidth: eachBarWidth,
					offset: barWidth / 2,
					height: h,
					width: barWidth,
				};
			});
	return after(bars);
}

export default wrap(StackedBarSeries);
