"use strict";

import React from "react";

import pure from "../pure";
import { shallowEqual } from "../utils";

class CurrentCoordinate extends React.Component {
	componentDidMount() {
		var { chartCanvasType, getCanvasContexts } = this.props;

		if (chartCanvasType !== "svg" && getCanvasContexts !== undefined) {
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
		// console.log("HERE111");

		var draw = CurrentCoordinate.drawOnCanvasStatic.bind(null, nextProps);
		var { id, chartId } = nextProps;

		if (!shallowEqual(this.props, nextProps)) {
			var temp = nextProps.getAllCanvasDrawCallback()
				.filter(each => each.type === "currentcoordinate")
				.filter(each => each.chartId === chartId)
				.filter(each => each.id === id);

			if (temp.length === 0) {
				nextProps.callbackForCanvasDraw({
					type: "currentcoordinate",
					id, chartId, draw,
				});
			} else {
				nextProps.callbackForCanvasDraw(temp[0], {
					type: "currentcoordinate",
					id, chartId, draw,
				});
			}
		}
	}
	render() {
		var { className } = this.props;
		var { chartCanvasType, show, chartConfig, currentItem, xScale } = this.props;

		if (chartCanvasType !== "svg") return null;

		var circle = CurrentCoordinate.helper(this.props, show, xScale, chartConfig.yScale, currentItem);

		if (!circle) return null;

		return (
			<circle className={className} cx={circle.x} cy={circle.y} r={circle.r} fill={circle.fill} />
		);
	}
}

CurrentCoordinate.propTypes = {
	id: React.PropTypes.number.isRequired,
	yAccessor: React.PropTypes.func,
	r: React.PropTypes.number.isRequired,
	className: React.PropTypes.string,
	xAccessor: React.PropTypes.func.isRequired,
	xScale: React.PropTypes.func.isRequired,
	chartCanvasType: React.PropTypes.string,
	getCanvasContexts: React.PropTypes.func,
	show: React.PropTypes.bool,
	chartId: React.PropTypes.number.isRequired,

	chartConfig: React.PropTypes.object.isRequired,
	currentItem: React.PropTypes.object.isRequired,

};

CurrentCoordinate.defaultProps = {
	r: 3,
	className: "react-stockcharts-current-coordinate",
};

CurrentCoordinate.drawOnCanvas = (canvasContext, props) => {
	var { mouseXY, chartConfig, currentItem, xScale, show } = props;

	CurrentCoordinate.drawOnCanvasStatic(props, canvasContext, show, xScale, chartConfig.yScale, currentItem);
};

// mouseContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem

CurrentCoordinate.drawOnCanvasStatic = (props, ctx, show, xScale, yScale, currentItem) => {
	var { margin, chartConfig, canvasOriginX, canvasOriginY } = props;

	var circle = CurrentCoordinate.helper(props, show, xScale, yScale, currentItem);

	if (!circle) return null;

	ctx.save();

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.translate(canvasOriginX, canvasOriginY);

	ctx.fillStyle = circle.fill;
	ctx.beginPath();
	ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
	ctx.fill();
	// CurrentCoordinate.drawOnCanvasStatic(ctx, pointer);
	ctx.restore();
};

CurrentCoordinate.helper = (props, show, xScale, yScale, currentItem) => {
	var { fill, xAccessor, yAccessor, r } = props;

	// console.log(show);
	if (!show || currentItem === undefined) return null;

	var xValue = xAccessor(currentItem);
	var yValue = yAccessor(currentItem);

	if (yValue === undefined) return null;

	// console.log(chartConfig);
	var x = Math.round(xScale(xValue));
	var y = Math.round(yScale(yValue));

	return { x, y, r, fill };
};

export default pure(CurrentCoordinate, {
	show: React.PropTypes.bool.isRequired,
	currentItem: React.PropTypes.object.isRequired,
	chartConfig: React.PropTypes.object.isRequired,
	mouseXY: React.PropTypes.array, // this is to avoid the flicker
	canvasOriginX: React.PropTypes.number,
	canvasOriginY: React.PropTypes.number,

	xAccessor: React.PropTypes.func.isRequired,
	xScale: React.PropTypes.func.isRequired,
	chartId: React.PropTypes.number.isRequired,
	getCanvasContexts: React.PropTypes.func,
	margin: React.PropTypes.object.isRequired,
	callbackForCanvasDraw: React.PropTypes.func.isRequired,
	getAllCanvasDrawCallback: React.PropTypes.func,
	chartCanvasType: React.PropTypes.string.isRequired,
}, ["mouseXY"]);
