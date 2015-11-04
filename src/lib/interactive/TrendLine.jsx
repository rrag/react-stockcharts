"use strict";

import React from "react";

function getYValue(values, currentValue) {
	var diff = values
		.map(each => each - currentValue)
		.reduce((diff1, diff2) => Math.abs(diff1) < Math.abs(diff2) ? diff1 : diff2);
	return currentValue + diff;
}

class TrendLine extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trends: [],
		}
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

		var draw = TrendLine.drawOnCanvas.bind(null, nextContext, this.state.trends, null);

		nextContext.callbackForCanvasDraw({
			type: "interactive",
			chartId: chartId,
			draw: draw,
		});
	}
	handleMouseMove(chartId, xAccessor, { mouseXY, currentItem, currentCharts, chartData }) {
		var { xScale, yScale } = chartData.plot.scales;

		var { snapTo } = this.props;

		var yValue = getYValue(snapTo(currentItem), yScale.invert(mouseXY[1]));
		var xValue = xAccessor(currentItem);

		if (this.state.start) {
			this.setState({
				tempEnd: [xValue, yValue],
				currentPos: [xValue, yValue],
			});
		} else {
			this.setState({
				currentPos: [xValue, yValue],
			})
		}
	}
	handleClick(chartId, xAccessor, {mouseXY, currentItem, currentCharts, chartData}) {
		// console.log({mouseXY, currentItem, currentCharts, chartData});
		var { start, trends } = this.state;

		var { xScale, yScale } = chartData.plot.scales;
		// var yValue = yScale.invert(mouseXY[1]);
		var { snapTo } = this.props;
		var yValue = getYValue(snapTo(currentItem), yScale.invert(mouseXY[1]));

		var xValue = xAccessor(currentItem);
		// console.log(xValue, yValue, snapTo(currentItem));
		if (start) {
			this.setState({
				start: null,
				trends: trends.concat({start, end: [xValue, yValue]}),
			}, () => {
				var draw = TrendLine.drawOnCanvas.bind(null, this.context, this.state.trends, null);

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
			var { start, tempEnd } = this.state;
			var temp = this.state.trends;
			if (start && tempEnd) {
				temp = this.state.trends.concat({ start, end: tempEnd });
			}
			if (contexts) {
				TrendLine.drawOnCanvas(this.context,
					temp, this.state.currentPos, contexts.interactive, { plotData, chartData });
			}
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	render() {
		var { chartCanvasType, chartData } = this.context;

		if (chartCanvasType !== "svg") return null;

		var { xScale, yScale } = chartData.plot.scales;
		var lines = TrendLine.helper(this.context, this.state.trends, chartData);

		return (
			<g>{lines
				.map((coords, idx) => 
					<line key={idx} stroke="black" x1={xScale(coords.x1)} y1={yScale(coords.y1)}
						x2={xScale(coords.x2)} y2={yScale(coords.y2)} />)}
			</g>
		);
	}
}

TrendLine.drawOnCanvas = ({ xAccessor, canvasOriginX, canvasOriginY, width, height }, 
		trends, currentPos, ctx, { plotData, chartData }) => {
	var lines = TrendLine.helper(plotData, xAccessor, trends, chartData);

	var { xScale, yScale } = chartData.plot.scales;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	ctx.rect(-1, -1, width + 1, height + 1);
	ctx.clip();


	if (currentPos) {
		ctx.strokeStyle = "steelblue";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(xScale(currentPos[0]), yScale(currentPos[1]), 3, 0, 2 * Math.PI, false);
		ctx.stroke();
	}
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";

	lines.forEach(each => {
		ctx.beginPath()
		ctx.moveTo(xScale(each.x1), yScale(each.y1));
		ctx.lineTo(xScale(each.x2), yScale(each.y2));
		// console.log(each);
		ctx.stroke();
	})

	ctx.restore();
}
TrendLine.helper = (plotData, xAccessor, trends, chartData) => {

	// var { trends } = this.state;
	var lines = trends
		.filter(each => each.start !== each.end)
		.map((each, idx) => generateLine(each.start, each.end, xAccessor, plotData));

	return lines;
}

function generateLine(start, end, xAccessor, plotData) {
	/* if (end[0] - start[0] === 0) {
		// vertical line
		throw new Error("Trendline cannot be a vertical line")
	} */
	var m /* slope */ = (end[1] - start[1]) / (end[0] - start[0])
	var b /* y intercept */ = -1 * m * end[0] + end[1]
	// y = m * x + b
	var x1 = xAccessor(plotData[0]);
	var y1 = m * x1 + b;

	var x2 = xAccessor(plotData[plotData.length - 1]);
	var y2 = m * x2 + b;
	return { x1, y1, x2, y2 };
}

TrendLine.contextTypes = {
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

TrendLine.propTypes = {
	snap: React.PropTypes.bool.isRequired,
	enabled: React.PropTypes.bool.isRequired,
	snapTo: React.PropTypes.func,
};

TrendLine.defaultProps = {
	snap: true,
	enabled: true,
};

export default TrendLine;
