"use strict";

import React from "react";
import pure from "../pure";

class CurrentCoordinate extends React.Component {
	componentDidMount() {
		var { type, getCanvasContexts } = this.props;

		if (type !== "svg" && getCanvasContexts !== undefined) {
			var contexts = getCanvasContexts();
			if (contexts) CurrentCoordinate.drawOnCanvas(contexts.mouseCoord, this.props);
		}
	}
	componentDidUpdate() {
		this.componentDidMount();
	}
	componentWillMount() {
		this.componentWillReceiveProps(this.props);
	}
	componentWillReceiveProps(nextProps) {
		var draw = CurrentCoordinate.drawOnCanvasStatic.bind(null, nextProps);

		var { forChart, forCompareSeries, forDataSeries } = nextProps;

		var temp = nextProps.getAllCanvasDrawCallback()
			.filter(each => each.type === "currentcoordinate" && each.forChart === forChart && each.forDataSeries === forDataSeries)
			.filter(each => each.forCompareSeries === forCompareSeries);

		if (temp.length === 0) {
			nextProps.callbackForCanvasDraw({
				type: "currentcoordinate",
				forChart,
				forDataSeries,
				forCompareSeries,
				draw,
			});
		} else {
			nextProps.callbackForCanvasDraw(temp[0], {
				type: "currentcoordinate",
				forChart,
				forDataSeries,
				forCompareSeries,
				draw,
			});
		}
	}
	render() {
		var { className } = this.props;
		var { type, show, chartData, currentItems } = this.props;

		if (type !== "svg") return null;

		var circle = CurrentCoordinate.helper(this.props, show, chartData, currentItems);

		if (!circle) return null;

		return (
			<circle className={className} cx={circle.x} cy={circle.y} r={circle.r} fill={circle.fill} />
		);
	}
}

CurrentCoordinate.propTypes = {
	forChart: React.PropTypes.number.isRequired,
	forDataSeries: React.PropTypes.number.isRequired,
	forCompareSeries: React.PropTypes.number,
	yAccessor: React.PropTypes.func,
	r: React.PropTypes.number.isRequired,
	className: React.PropTypes.string,
};

CurrentCoordinate.defaultProps = {
	r: 3
};

CurrentCoordinate.drawOnCanvas = (canvasContext, props) => {
	var { mouseXY, currentCharts, chartData, currentItems, show } = props;

	CurrentCoordinate.drawOnCanvasStatic(props, canvasContext, show, mouseXY, currentCharts, chartData, currentItems);
};

CurrentCoordinate.drawOnCanvasStatic = (props, ctx, show, mouseXY, currentCharts, chartData, currentItems) => {
	var { margin } = props;
	var circle = CurrentCoordinate.helper(props, show, chartData, currentItems);

	if (!circle) return null;

	var originX = 0.5 + margin.left;
	var originY = 0.5 + margin.top;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(originX, originY);

	ctx.fillStyle = circle.fill;
	ctx.beginPath();
	ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
	ctx.fill();
	// CurrentCoordinate.drawOnCanvasStatic(ctx, pointer);
	ctx.restore();
};

CurrentCoordinate.helper = (props, show, chartData, currentItems) => {
	var { forChart, forCompareSeries, forDataSeries, r } = props;

	var chartData = chartData.filter((each) => each.id === forChart)[0];
	var currentItem = currentItems.filter((each) => each.id === forChart)[0];
	var item = currentItem ? currentItem.data : undefined;
	var fill = "black";

	if (!show || item === undefined) return null;
	var yAccessor;

	if (forCompareSeries !== undefined) {
		var compSeries = chartData.config.compareSeries
			.filter((each) => each.id === forCompareSeries);

		if (compSeries.length !== 1) {
			console.warn("Unique compareSeries with id={%s} not found", forCompareSeries);
			throw new Error("Unique compareSeries not found");
		}
		fill = compSeries[0].stroke;
		yAccessor = compSeries[0].percentYAccessor;
	} else if (forDataSeries !== undefined) {
		var overlays = chartData.config.overlays
			.filter((each) => each.id === forDataSeries);

		if (overlays.length !== 1) {
			console.warn("Unique DataSeries with id={%s} not found", forDataSeries);
			throw new Error("Unique DataSeries not found");
		}

		fill = overlays[0].stroke;

		yAccessor = overlays[0].yAccessor;
	}

	var xValue = chartData.config.xAccessor(item);
	var yValue = yAccessor(item);

	if (yValue === undefined) return null;

	var x = Math.round(chartData.plot.scales.xScale(xValue)) + chartData.config.origin[0];
	var y = Math.round(chartData.plot.scales.yScale(yValue)) + chartData.config.origin[1];

	return { x, y, r, fill };
};

export default pure(CurrentCoordinate, {
	show: React.PropTypes.bool.isRequired,
	currentItems: React.PropTypes.array.isRequired,
	chartData: React.PropTypes.array.isRequired,

	getCanvasContexts: React.PropTypes.func,
	margin: React.PropTypes.object.isRequired,
	callbackForCanvasDraw: React.PropTypes.func.isRequired,
	getAllCanvasDrawCallback: React.PropTypes.func,
	type: React.PropTypes.string.isRequired,
});
