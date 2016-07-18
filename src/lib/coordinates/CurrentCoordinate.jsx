"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";
import { shallowEqual, isDefined, isNotDefined } from "../utils";

class CurrentCoordinate extends Component {
	componentDidMount() {
		var { chartCanvasType, getCanvasContexts } = this.props;

		if (chartCanvasType !== "svg" && isDefined(getCanvasContexts)) {
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
	id: PropTypes.number.isRequired,
	yAccessor: PropTypes.func,
	r: PropTypes.number.isRequired,
	className: PropTypes.string,
	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	chartCanvasType: PropTypes.string,
	getCanvasContexts: PropTypes.func,
	show: PropTypes.bool,
	chartId: PropTypes.number.isRequired,

	chartConfig: PropTypes.object.isRequired,
	currentItem: PropTypes.object,

};

CurrentCoordinate.defaultProps = {
	r: 3,
	className: "react-stockcharts-current-coordinate",
};

CurrentCoordinate.drawOnCanvas = (canvasContext, props) => {
	var { chartConfig, currentItem, xScale, show } = props;

	CurrentCoordinate.drawOnCanvasStatic(props, canvasContext, show, xScale, chartConfig.yScale, currentItem);
};

// mouseContext, show, xScale, mouseXY, currentCharts, chartConfig, currentItem

CurrentCoordinate.drawOnCanvasStatic = (props, ctx, show, xScale, yScale, currentItem) => {
	var { canvasOriginX, canvasOriginY } = props;

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
	if (!show || isNotDefined(currentItem)) return null;

	var xValue = xAccessor(currentItem);
	var yValue = yAccessor(currentItem);

	if (isNotDefined(yValue)) return null;

	// console.log(chartConfig);
	var x = Math.round(xScale(xValue));
	var y = Math.round(yScale(yValue));

	return { x, y, r, fill };
};

export default pure(CurrentCoordinate, {
	show: PropTypes.bool.isRequired,
	currentItem: PropTypes.object,
	chartConfig: PropTypes.object.isRequired,
	mouseXY: PropTypes.array, // this is to avoid the flicker
	canvasOriginX: PropTypes.number,
	canvasOriginY: PropTypes.number,

	xAccessor: PropTypes.func.isRequired,
	xScale: PropTypes.func.isRequired,
	chartId: PropTypes.number.isRequired,
	getCanvasContexts: PropTypes.func,
	margin: PropTypes.object.isRequired,
	callbackForCanvasDraw: PropTypes.func.isRequired,
	getAllCanvasDrawCallback: PropTypes.func,
	chartCanvasType: PropTypes.string.isRequired,
}, ["mouseXY"]);
