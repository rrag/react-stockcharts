"use strict";

import React from "react";

class HistogramSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getBars = this.getBars.bind(this);
		this.getBarsSVG = this.getBarsSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.context.type !== "svg") this.drawOnCanvas();
	}
	drawOnCanvas() {
		var ctx = this.context.canvasContext;
		var bars = this.getBars();

		var { fillStyle, strokeStyle, globalAlpha } = ctx;
		ctx.globalAlpha = this.props.opacity;

		bars.forEach(d => {
			if (d.barWidth < 1) {
				/* <line key={idx} className={d.className}
							stroke={this.props.stroke}
							fill={this.props.fill}
							x1={d.x} y1={d.y}
							x2={d.x} y2={d.y + d.height} />*/
				// ctx.fillStyle = d.fill;
				ctx.strokeStyle = d.fill;
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x, d.y + d.height);
				ctx.stroke();
			} else {
				/* <rect key={idx} className={d.className}
						stroke={this.props.stroke}
						fill={this.props.fill}
						x={d.x}
						y={d.y}
						width={d.barWidth}
						height={d.height} /> */
				ctx.fillStyle = d.fill;
				ctx.strokeStyle = d.stroke;
				ctx.beginPath();
				ctx.rect(d.x, d.y, d.barWidth, d.height);
				ctx.closePath();
				ctx.fill();
			}
		});

		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
		ctx.globalAlpha = globalAlpha;

	}
	getBars() {
		var base = this.props.baseAt === "top"
					? 0
					: this.props.baseAt === "bottom"
						? this.context.yScale.range()[0]
						: this.props.baseAt === "middle"
							? (this.context.yScale.range()[0] + this.context.yScale.range()[1]) / 2
							: this.props.baseAt;

		var dir = this.props.direction === "up" ? -1 : 1;

		var getClassName = () => this.props.className;
		if (typeof this.props.className === "function") {
			getClassName = this.props.className;
		}

		var getFill = () => this.props.fill;
		if (typeof this.props.fill === "function") {
			getFill = this.props.fill;
		}

		var width = Math.abs(this.context.xScale.range()[0] - this.context.xScale.range()[1]);
		var barWidth = width / (this.context.plotData.length) * 0.5;

		var bars = this.context.plotData
				.filter((d) => (this.context.yAccessor(d) !== undefined) )
				.map((d, idx) => {
					var yValue = this.context.yAccessor(d);
					var x = Math.round(this.context.xScale(this.context.xAccessor(d))) - 0.5 * barWidth,
						className = getClassName(d), y, height;

					if (dir > 0) {
						y = base;
						height = this.context.yScale.range()[0] - this.context.yScale(yValue);
					} else {
						y = this.context.yScale(yValue);
						height = base - y;
					}

					if (height < 0) {
						y = base;
						height = -height;
					}
					return {
						barWidth: Math.round(barWidth),
						height: Math.round(height),
						x: Math.round(x),
						y: Math.round(y),
						className: className,
						stroke: this.props.stroke,
						fill: getFill(d),
					};
				});
		return bars;
	}
	getBarsSVG() {
		var bars = this.getBars();
		return bars.map((d, idx) => {
			if (d.barWidth <= 1) {
				return <line key={idx} className={d.className}
							stroke={d.stroke}
							fill={d.fill}
							x1={d.x} y1={d.y}
							x2={d.x} y2={d.y + d.height} />;
			}
			return <rect key={idx} className={d.className}
						stroke={d.stroke}
						fill={d.fill}
						x={d.x}
						y={d.y}
						width={d.barWidth}
						opacity={this.props.opacity}
						height={d.height} />;
		});
	}
	render() {
		if (this.context.type !== "svg") return null;
		return (
			<g className="histogram">
				{this.getBarsSVG()}
			</g>
		);
	}
}

HistogramSeries.propTypes = {
	baseAt: React.PropTypes.oneOfType([
				React.PropTypes.oneOf(["top", "bottom", "middle"])
				, React.PropTypes.number
			]).isRequired,
	direction: React.PropTypes.oneOf(["up", "down"]).isRequired,
	stroke: React.PropTypes.string,
	opacity: React.PropTypes.number.isRequired,
	fill: React.PropTypes.oneOfType([
			React.PropTypes.func, React.PropTypes.string
		]).isRequired,
	className: React.PropTypes.oneOfType([
			React.PropTypes.func, React.PropTypes.string
		]).isRequired,
};

HistogramSeries.defaultProps = {
	namespace: "ReStock.HistogramSeries",
	baseAt: "bottom",
	direction: "up",
	className: "bar",
	stroke: "none",
	fill: "steelblue",
	opacity: 0.5,
};

HistogramSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	canvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
};

module.exports = HistogramSeries;
