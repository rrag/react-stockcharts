"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";
import GenericComponent from "../GenericComponent";
import { shallowEqual, isDefined, isNotDefined } from "../utils";

class CurrentCoordinate extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var circle = helper(this.props, this.context, moreProps);
		if (!circle) return null;

		ctx.fillStyle = circle.fill;
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
		ctx.fill();
	}
	renderSVG(moreProps) {
		var { className } = this.props;
		var { show, chartConfig, currentItem, xScale } = moreProps;

		var circle = helper(this.props, this.context, moreProps);
		if (!circle) return null;

		return (
			<circle className={className} cx={circle.x} cy={circle.y} r={circle.r} fill={circle.fill} />
		);
	}
	render() {
		return <GenericComponent
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			drawOnMouseMove
			drawOnPan
			drawOnMouseExitOfCanvas
			/>
	}
}

CurrentCoordinate.propTypes = {
	id: PropTypes.number.isRequired,
	yAccessor: PropTypes.func,
	r: PropTypes.number.isRequired,
	className: PropTypes.string,
};

CurrentCoordinate.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
}

CurrentCoordinate.defaultProps = {
	r: 3,
	className: "react-stockcharts-current-coordinate",
};

function helper(props, context, moreProps) {
	var { fill, yAccessor, r } = props;
	var { xAccessor } = context;

	var { show, xScale, chartConfig: { yScale }, currentItem } = moreProps;

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

export default CurrentCoordinate
