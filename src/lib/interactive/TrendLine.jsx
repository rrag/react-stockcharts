"use strict";

import React from "react";

class TrendLine extends React.Component {
	componentWillMount() {
		var { subscribe, chartId, xAccessor } = this.context;
		var subscriptionId = subscribe(chartId, "mouseup", this.handleClick.bind(this, chartId, xAccessor));
		this.setState({
			subscriptionId
		})
	}
	handleClick(chartId, xAccessor, {mouseXY, currentItem, currentCharts, chartData}) {
		// console.log({mouseXY, currentItem, currentCharts, chartData});
		var { start } = this.state;

		var { xScale, yScale } = chartData.plot.scales;
		var yValue = yScale.invert(mouseXY[1]);
		var xValue = xAccessor(currentItem);
		var { snapTo } = this.props;
		console.log(xValue, yValue, snapTo(currentItem));
		if (start) {
			this.setState({
				end: [xValue, yValue],
			});
		} else {
			this.setState({
				start: [xValue, yValue],
			});
		}
	}
	componentWillUnmount() {
		var { unsubscribe } = this.context;
		unsubscribe(this.state.subscriptionId);
	}
	render() {
		var { chartCanvasType, plotData, xAccessor, chartData } = this.context;
		var { xScale, yScale } = chartData.plot.scales;

		var { trendLines } = this.props;
		trendLines = trendLines || [];

		var { start, end } = this.state;
		console.log(start, end);
		if (start && end) {
			var coords = generateLine(start, end, xAccessor, plotData);
			return <line stroke="black" x1={xScale(coords.x1)} y1={yScale(coords.y1)}
				x2={xScale(coords.x2)} y2={yScale(coords.y2)} />
		}
		// console.log(trendLines);

		// var lines = trendLines.map(line => generateLine(line));
		// console.log(lines);

		// console.log(mouseXY, mainChart, currentItems.filter(each => each.id === mainChart)[0]);
		return (
			<g></g>
		);
	}
}

function generateLine(start, end, xAccessor, plotData) {
	if (end[0] - start[0] === 0) {
		// vertical line
		throw new Error("Trendline cannot be a vertical line")
	}
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
	chartCanvasType: React.PropTypes.string.isRequired,
	subscribe: React.PropTypes.func.isRequired,
	unsubscribe: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	chartData: React.PropTypes.object.isRequired,
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
