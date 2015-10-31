"use strict";

import React from "react";

class TrendLine extends React.Component {
	componentWillMount() {
		var { subscribe } = this.context;
		subscribe("mouseup", () => {console.log("JHHH")});
	}
	render() {
		var { type, mainChart, mouseXY, currentCharts, chartData, currentItems, show } = this.context;
		console.log(mouseXY, mainChart, currentItems.filter(each => each.id === mainChart)[0]);
		return (
			<g>
			</g>
		);
	}
}

TrendLine.contextTypes = {
	mainChart: React.PropTypes.number.isRequired,
	mouseXY: React.PropTypes.array,
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	currentCharts: React.PropTypes.array.isRequired,
	getCanvasContexts: React.PropTypes.func,
	margin: React.PropTypes.object.isRequired,
	callbackForCanvasDraw: React.PropTypes.func.isRequired,
	type: React.PropTypes.string.isRequired,
	subscribe: React.PropTypes.func.isRequired,
};

TrendLine.propTypes = {
	snap: React.PropTypes.bool.isRequired,
};

TrendLine.defaultProps = {
	namespace: "ReStock.MouseCoordinates",
	show: false,
	snap: true,
};


TrendLine.yAccessor = (d) => d.close;

export default TrendLine;
