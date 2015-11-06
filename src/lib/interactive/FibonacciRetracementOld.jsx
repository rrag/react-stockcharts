"use strict";

import React from "react";

class FibonacciRetracement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			indicator: {
				retracements: []
			}
		};
	}
	componentWillMount() {
		var { subscribe, chartId, xAccessor } = this.context;
		var clickSubscription = subscribe(chartId, "click", this.handleClick.bind(this, chartId, xAccessor));
		var mouseMoveSubscription = subscribe(chartId, "mousemove", this.handleMouseMove.bind(this, chartId, xAccessor));

		this.componentWillReceiveProps(this.props, this.context);
		this.setState({
			clickSubscription, mouseMoveSubscription,
		});
	}
	componentWillReceiveProps(nextProps, nextContext) {
		var { chartId } = nextContext;
		var { retracements } = this.state.indicator;

		var draw = FibonacciRetracement.drawOnCanvas.bind(null, nextContext, retracements, null);

		nextContext.callbackForCanvasDraw({
			type: "interactive",
			chartId: chartId,
			draw: draw,
		});
	}
	handleMouseMove(chartId, xAccessor, { mouseXY, currentItem, currentCharts, chartData }) {
		var { xScale, yScale } = chartData.plot.scales;

		var { snapTo } = this.props;

		var yValue = yScale.invert(mouseXY[1]);
		var xValue = xAccessor(currentItem);

		if (this.state.start) {
			this.setState({
				tempEnd: [xValue, yValue],
				currentPos: [xValue, yValue],
			});
		} else {
			this.setState({
				currentPos: [xValue, yValue],
			});
		}
	}
	handleClick(chartId, xAccessor, { mouseXY, currentItem, currentCharts, chartData }) {
		// console.log({mouseXY, currentItem, currentCharts, chartData});
		var { start, retracements } = this.state.interactive;

		var { xScale, yScale } = chartData.plot.scales;
		// var yValue = yScale.invert(mouseXY[1]);
		var { snapTo } = this.props;
		var yValue = yScale.invert(mouseXY[1]);

		var xValue = xAccessor(currentItem);
		// console.log(start);
		if (start) {
			this.setState({
				start: null,
				retracements: retracements.concat({start, end: [xValue, yValue]}),
			}, () => {
				var { retracements } = this.state.interactive;
				var draw = FibonacciRetracement.drawOnCanvas.bind(null, this.context, retracements, null);

				var temp = this.context.getAllCanvasDrawCallback().filter(each => each.type === "interactive");
				if (temp.length > 0) {
					this.context.callbackForCanvasDraw(temp[0], {
						type: "interactive",
						chartId: chartId,
						draw: draw,
					});
				}
			});
		} else {
			this.setState({
				start: [xValue, yValue],
			});
		}
	}
	componentWillUnmount() {
		var { unsubscribe } = this.context;
		unsubscribe(this.state.clickSubscription);
		unsubscribe(this.state.mouseMoveSubscription);
	}
	componentDidMount() {
		var { getCanvasContexts, chartCanvasType, plotData, chartData } = this.context;

		if (chartCanvasType !== "svg" && getCanvasContexts !== undefined) {
			var contexts = getCanvasContexts();
			var { start, tempEnd, retracements } = this.state.interactive;
			var temp = retracements;
			if (start && tempEnd) {
				temp = retracements.concat({ start, end: tempEnd });
			}
			if (contexts) {
				FibonacciRetracement.drawOnCanvas(this.context,
					temp, this.state.currentPos, contexts.interactive, { plotData, chartData });
			}
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	render() {
		var { chartCanvasType, chartData, plotData, xAccessor } = this.context;

		if (chartCanvasType !== "svg") return null;

		var { xScale, yScale } = chartData.plot.scales;
		var { retracements, currentPos, start, tempEnd } = this.state.interactive;

		var temp = retracements;
		if (start && tempEnd) {
			temp = retracements.concat({ start, end: tempEnd });
		}

		var lines = FibonacciRetracement.helper(plotData, xAccessor, temp, chartData);

		var circle = (currentPos)
			? <circle cx={xScale(currentPos[0])} cy={yScale(currentPos[1])} stroke="steelblue" fill="none" strokeWidth={2} r={3} />
			: null;
		// console.log(circle);
		return (
			<g>
				{circle}
				{lines
				.map((coords, idx) => 
					<line key={idx} stroke="black" x1={xScale(coords.x1)} y1={yScale(coords.y1)}
						x2={xScale(coords.x2)} y2={yScale(coords.y2)} />)}
			</g>
		);
	}
}

FibonacciRetracement.drawOnCanvas = ({ xAccessor, canvasOriginX, canvasOriginY, width, height }, 
		retracements, currentPos, ctx, { plotData, chartData }) => {
	var lines = FibonacciRetracement.helper(plotData, xAccessor, retracements, chartData);

	var { xScale, yScale } = chartData.plot.scales;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	ctx.rect(-1, -1, width + 1, height + 1);
	ctx.clip();

	ctx.strokeStyle = "black";

	lines.forEach(retracements => {
		var dir = retracements[0].y1 > retracements[retracements.length - 1].y1 ? 3 : -1.3

		retracements.forEach((each) => {
			ctx.beginPath();
			ctx.moveTo(0, yScale(each.y));
			ctx.lineTo(width, yScale(each.y));

			var text = `${ each.y.toFixed(2) } (${ each.percent.toFixed(2) }%)`
			ctx.fillText(text, 10, yScale(each.y) + dir * 4);

			ctx.stroke();
		})
	});

	ctx.restore();
};

FibonacciRetracement.helper = (plotData, xAccessor, retracements, chartData) => {
	var lines = retracements
		.filter(each => each.start[0] !== each.end[0])
		.map((each, idx) => generateLine(each.start, each.end, xAccessor, plotData));

	return lines;
};

function generateLine(start, end, xAccessor, plotData) {
	/* if (end[0] - start[0] === 0) {
		// vertical line
		throw new Error("FibonacciRetracement cannot be a vertical line")
	} */
	// 23.6, 38.2, 50.0, 61.8, 78.6, 100
	var first = xAccessor(plotData[0]);
	var last = xAccessor(plotData[plotData.length - 1]);
	var dy = end[1] - start[1];
	return [100, 61.8, 50, 38.2, 23.6, 0]
		.map(each => ({ percent: each, y: (end[1] - (each / 100) * dy) }))
		// .map(each => ({ percent: each.percent, y: each.y, y2: each.y }));
}

FibonacciRetracement.contextTypes = {
	chartId: React.PropTypes.number.isRequired,
	getCanvasContexts: React.PropTypes.func,
	callbackForCanvasDraw: React.PropTypes.func.isRequired,
	getAllCanvasDrawCallback: React.PropTypes.func,
	chartCanvasType: React.PropTypes.string.isRequired,
	subscribe: React.PropTypes.func.isRequired,
	unsubscribe: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	chartData: React.PropTypes.object.isRequired,
	canvasOriginX: React.PropTypes.number,
	canvasOriginY: React.PropTypes.number,
	height: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
};

FibonacciRetracement.propTypes = {
	snap: React.PropTypes.bool.isRequired,
	enabled: React.PropTypes.bool.isRequired,
	snapTo: React.PropTypes.func,
};

FibonacciRetracement.defaultProps = {
	snap: true,
	enabled: true,
};

export default FibonacciRetracement;
