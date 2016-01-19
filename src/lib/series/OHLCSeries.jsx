"use strict";

import React from "react";

import wrap from "./wrap";
import { isDefined, isNotDefined, hexToRGBA } from "../utils/utils";

class OHLCSeries extends React.Component {
	render() {
		var { className, wickClassName, candleClassName } = this.props;
		var { xAccessor, yAccessor, xScale, yScale, compareSeries, plotData } = this.props;

		var barData = OHLCSeries.getOHLCBars(this.props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData);

		var { barWidth, strokeWidth, bars } = barData;

		return <g className={className}>
			{bars.map((d, idx) => <path key={idx}
				className={d.className} stroke={d.stroke} strokeWidth={strokeWidth} 
				d={`M${d.openX1} ${d.openY} L${d.openX2} ${d.openY} M${d.x} ${d.y1} L${d.x} ${d.y2} M${d.closeX1} ${d.closeY} L${d.closeX2} ${d.closeY}`}/>)}
		</g>;
	}
}

OHLCSeries.propTypes = {
	className: React.PropTypes.string,
	classNames: React.PropTypes.shape({
		up: React.PropTypes.string,
		down: React.PropTypes.string
	}),
	stroke: React.PropTypes.shape({
		up: React.PropTypes.string,
		down: React.PropTypes.string
	}),
	firstBarstroke: React.PropTypes.string,
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	xScale: React.PropTypes.func,
	yScale: React.PropTypes.func,
	changeAccessor: React.PropTypes.func,
	compareSeries: React.PropTypes.array,
	plotData: React.PropTypes.array,
};

OHLCSeries.defaultProps = {
	className: "react-stockcharts-ohlc",
	classNames: {
		up: "up",
		down: "down"
	},
	stroke: {
		up: "#6BA583",
		down: "#FF0000"
	},
	firstBarClassName: "firstbar",
	firstBarstroke: "#000000",
	changeAccessor: d => d.change,
	opacity: 1,
};

OHLCSeries.yAccessor = (d) => ({ open: d.open, high: d.high, low: d.low, close: d.close });

OHLCSeries.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { compareSeries, xAccessor, yAccessor, indicator } = props;

	var barData = OHLCSeries.getOHLCBars(props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData);

	var { barWidth, strokeWidth, bars } = barData;

	var wickNest = d3.nest()
		.key(d => d.stroke)
		.entries(bars);

	ctx.lineWidth = strokeWidth;

	wickNest.forEach(outer => {
		var { key, values } = outer;
		ctx.strokeStyle = key;
		values.forEach(d => {
			ctx.beginPath();
			ctx.moveTo(d.x, d.y1);
			ctx.lineTo(d.x, d.y2);

			ctx.moveTo(d.openX1, d.openY);
			ctx.lineTo(d.openX2, d.openY);

			ctx.moveTo(d.closeX1, d.closeY);
			ctx.lineTo(d.closeX2, d.closeY);

			ctx.stroke();
		})
	});
};

OHLCSeries.getOHLCBars = (props, xAccessor, yAccessor, xScale, yScale, compareSeries, plotData) => {
	var isCompareSeries = compareSeries.length > 0;

	var { indicator, changeAccessor, classNames, stroke: barStroke, firstBarClassName, firstBarStroke } = props;

	var { up: upStroke, down: downStroke } = barStroke;
	if (isDefined(indicator) && isDefined(indicator.strokeProvider)) {
		upStroke = downStroke = indicator.strokeProvider();
	}
	upStroke = d3.functor(upStroke);
	downStroke = d3.functor(downStroke);

	var width = xScale(xAccessor(plotData[plotData.length - 1]))
		- xScale(xAccessor(plotData[0]));

	var barWidth = Math.max(1, Math.round(width / (plotData.length - 1) / 2) - 1.5);
	var strokeWidth = Math.min(barWidth, 6);

	var bars = plotData
			.filter((d) => d.close !== undefined)
			.map((d) => {
				var ohlc = isCompareSeries ? yAccessor(d.compare) : yAccessor(d),
					change = changeAccessor(d),
					first = isNotDefined(change),
					up = !first && change.absolute >= 0,
					x = Math.round(xScale(xAccessor(d))),
					y1 = yScale(ohlc.high),
					y2 = yScale(ohlc.low),
					openX1 = x - barWidth,
					openX2 = x + strokeWidth / 2,
					openY = yScale(ohlc.open),
					closeX1 = x - strokeWidth / 2,
					closeX2 = x + barWidth,
					closeY = yScale(ohlc.close),
					className = up ? classNames.up : classNames.down,
					stroke = up ? upStroke(d) : downStroke(d);

				className = first ? firstBarClassName : className;
				stroke = first ? firstBarStroke : stroke;
				return { x, y1, y2, openX1, openX2, openY, closeX1, closeX2, closeY, stroke, className };
			});
	return { barWidth, strokeWidth, bars };
};

export default wrap(OHLCSeries);
