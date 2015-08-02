'use strict';

import React from "react";
import d3 from "d3";

function d3_identity(d) {
	return d;
}

function tickTransform_svg_axisX(scale, tick) {
	return `translate(${ scale(tick) }, 0)`;
}

function tickTransform_svg_axisY(scale, tick) {
	return `translate(0, ${ scale(tick) })`;
}

class Tick extends React.Component {
	render() {
		var { transform, tickStroke, textAnchor } = this.props;
		var { x, y, x2, y2, dy } = this.props;
		return (
			<g className="tick" transform={transform} >
				<line shapeRendering="crispEdges" opacity={1} stroke={tickStroke} x2={x2} y2={y2} />
				<text strokeWidth="0.01"
					dy={dy} x={x} y={y}
					textAnchor={textAnchor}>
					{this.props.children}
				</text>
			</g>
		);
	}
}

class AxisTicks extends React.Component {
	render() {
		var { orient, innerTickSize, tickFormat, tickPadding } = this.props;
		var { tickSize, ticks : tickArguments, tickValues, scale } = this.props;

		var ticks = tickValues === undefined
			? (scale.ticks
				? scale.ticks.apply(scale, tickArguments)
				: scale.domain())
			: tickValues

		var format = tickFormat === undefined
			? (scale.tickFormat
				? scale.tickFormat.apply(scale, tickArguments)
				: d3_identity)
			: tickFormat;

		var sign = orient === "top" || orient === "left" ? -1 : 1;
		var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

		var tickTransform, x, y, x2, y2, dy, textAnchor;

		if (orient === "bottom" || orient === "top") {
			tickTransform = tickTransform_svg_axisX;
			x2 = 0;
			y2 = sign * innerTickSize;
			x = 0;
			y = sign * tickSpacing;
			dy = sign < 0 ? "0em" : ".71em";
			textAnchor = "middle";
		} else {
			tickTransform = tickTransform_svg_axisY;
			x2 = sign * innerTickSize;
			y2 = 0;
			x = sign * tickSpacing;
			y = 0;
			dy = ".32em";
			textAnchor = sign < 0 ? "end" : "start";
		}

		return (
			<g>
				{ticks.map( (tick, idx) => {
					return (
						<Tick key={idx} transform={tickTransform(scale, tick)} tickStroke={this.props.tickStroke}
							dy={dy} x={x} y={y}
							x2={x2} y2={y2} textAnchor={textAnchor}>{format(tick)}</Tick>
					);
					})
				}
			</g>
		);
	}
}

AxisTicks.propTypes = {
	orient: React.PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
	innerTickSize: React.PropTypes.number,
	tickFormat: React.PropTypes.func,
	tickPadding: React.PropTypes.number,
	ticks: React.PropTypes.array,
	tickValues: React.PropTypes.array,
	scale: React.PropTypes.func.isRequired,
	tickStroke: React.PropTypes.string,
};

AxisTicks.defaultProps = {
	innerTickSize: 6,
	tickPadding: 3,
	ticks: [10],
	tickStroke: "#000",
};

module.exports = AxisTicks;
