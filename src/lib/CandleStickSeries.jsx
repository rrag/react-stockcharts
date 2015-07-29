"use strict";

import React from "react";

class CandlestickSeries extends React.Component {
	constructor(props) {
		super(props);
		this.getWickData = this.getWickData.bind(this);
		this.getWicksSVG = this.getWicksSVG.bind(this);
		this.getCandleData = this.getCandleData.bind(this);
		this.getCandlesSVG = this.getCandlesSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}/*
	componentDidMount() {
		if (this.context.type !== "svg") this.drawOnCanvas();
	}*/
	componentDidUpdate(prevProps, prevState, prevContext) {
		if (this.context.type !== "svg") this.drawOnCanvas();
	}
	drawOnCanvas() {
		var ctx = this.context.canvasContext;
		var wickData = this.getWickData();
		wickData.forEach(d => {
			ctx.beginPath();
			ctx.moveTo(d.x1, d.y1);
			ctx.lineTo(d.x2, d.y2);
			ctx.stroke();
		})
		var candleData = this.getCandleData();
		candleData.forEach(d => {
			if (d.width < 0) {
				// <line className={d.className} key={idx} x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.height}/>
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x, d.y + d.height);
				ctx.stroke();
			} else if (d.height === 0) {
				// <line key={idx} x1={d.x} y1={d.y} x2={d.x + d.width} y2={d.y + d.height} />
				ctx.beginPath();
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x + d.width, d.y + d.height);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.rect(d.x, d.y, d.width, d.height);
				ctx.closePath();
				ctx.fill();
			}
		});
	}
	getWickData() {
		var wickData = this.context.plotData
				.filter((d) => d.close !== undefined)
				.map((d, idx) => {
					// console.log(this.context.yAccessor);
					var ohlc = this.context.isCompareSeries ? this.context.yAccessor(d.compare) : this.context.yAccessor(d);

					var x1 = Math.round(this.context.xScale(this.context.xAccessor(d))),
						y1 = this.context.yScale(ohlc.high),
						x2 = x1,
						y2 = this.context.yScale(ohlc.low),
						className = (ohlc.open >= ohlc.close) ? "up" : "down";

					return {
						x1: x1,
						y1: y1,
						x2: x2,
						y2: y2,
						className: className,
					};
				});
		return wickData;
	}
	getWicksSVG() {
		var wickData = this.getWickData();
		var wicks = wickData
			.map((d, idx) => <line key={idx} className={d.className}
									x1={d.x1}
									y1={d.y1}
									x2={d.x2}
									y2={d.y2} />);
		return wicks;
	}
	getCandleData() {
		var width = this.context.xScale(this.context.xAccessor(this.context.plotData[this.context.plotData.length - 1]))
			- this.context.xScale(this.context.xAccessor(this.context.plotData[0]));
		var cw = (width / (this.context.plotData.length)) * 0.5;
		var candleWidth = Math.floor(cw) % 2 === 0 ? Math.floor(cw) : Math.round(cw);
		var candles = this.context.plotData
				.filter((d) => d.close !== undefined)
				.map((d, idx) => {
					var ohlc = this.context.isCompareSeries ? this.context.yAccessor(d.compare) : this.context.yAccessor(d);
					var x = Math.round(this.context.xScale(this.context.xAccessor(d)))
							- (candleWidth === 1 ? 0 : 0.5 * candleWidth),
						y = this.context.yScale(Math.max(ohlc.open, ohlc.close)),
						height = Math.abs(this.context.yScale(ohlc.open) - this.context.yScale(ohlc.close)),
						className = (ohlc.open <= ohlc.close) ? "up" : "down";
					return {
						// type: "line"
						x: x,
						y: y,
						height: height,
						width: candleWidth,
						className: className
					};
				});
		return candles;
	}
	getCandlesSVG() {
		var candleData = this.getCandleData();
		var candles = candleData.map((d, idx) => {
			if (d.width < 0) return <line className={d.className} key={idx} x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.height}/>
			else if (d.height === 0) return <line key={idx} x1={d.x} y1={d.y} x2={d.x + d.width} y2={d.y + d.height} />
			return <rect  className={d.className} key={idx} x={d.x} y={d.y} width={d.width} height={d.height} />
		})
		return candles;
	}
	render() {
		if (this.context.type !== "svg") return null;
		return (
			<g>
				<g className="wick" key="wicks">
					{this.getWicksSVG()}
				</g>
				<g className="candle" key="candles">
					{this.getCandlesSVG()}
				</g>
			</g>
		);
	}
}

CandlestickSeries.contextTypes = {
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	isCompareSeries: React.PropTypes.bool.isRequired,
	canvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
};

CandlestickSeries.defaultProps = { namespace: "ReStock.CandlestickSeries" };

CandlestickSeries.yAccessor = (d) => ({open: d.open, high: d.high, low: d.low, close: d.close});

module.exports = CandlestickSeries;
