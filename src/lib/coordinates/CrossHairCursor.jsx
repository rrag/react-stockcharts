"use strict";

import React, { PropTypes } from "react";
import GenericComponent from "../GenericComponent";
import PureComponent from "../utils/PureComponent";

import { hexToRGBA, isDefined, isNotDefined } from "../utils";

class CrossHairCursor extends PureComponent {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var lines = helper(this.props, this.context, moreProps);

		if (isDefined(lines)) {

			var { margin } = this.context;
			var originX = 0.5 + margin.left;
			var originY = 0.5 + margin.top;

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.translate(originX, originY);

			lines.forEach(line => {

				ctx.strokeStyle = hexToRGBA(line.stroke, line.opacity);
				var dashArray = line.strokeDasharray.split(",").map(d => +d);
				ctx.setLineDash(dashArray);
				ctx.beginPath();
				ctx.moveTo(line.x1, line.y1);
				ctx.lineTo(line.x2, line.y2);
				ctx.stroke();
			});

			ctx.restore();
		}
	}
	renderSVG(moreProps) {
		var { className } = this.props;
		var lines = helper(this.props, this.context, moreProps);

		if (isNotDefined(lines)) return null;

		return (
			<g className={`react-stockcharts-crosshair ${className}`}>
				{lines.map((each, idx) =>
					<line key={idx} {...each} />)}
			</g>
		);
	}
	render() {
		return <GenericComponent
			svgDraw={this.renderSVG}
			clip={false}
			canvasDraw={this.drawOnCanvas}
			drawOnMouseMove
			drawOnPan
			drawOnMouseExitOfCanvas
			/>;
	}
}

CrossHairCursor.propTypes = {
};

CrossHairCursor.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	margin: PropTypes.object.isRequired,
	xScale: PropTypes.func.isRequired,
};

CrossHairCursor.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	strokeDasharray: "4, 2",
	snapX: true,
};

function helper(props, context, { mouseXY, xScale, currentItem, show }) {
	var { height, width, xAccessor } = context;
	var { snapX, stroke, opacity, strokeDasharray } = props;

	if (!show || isNotDefined(currentItem)) return null;

	var line1 = {
		x1: 0,
		x2: width,
		y1: mouseXY[1],
		y2: mouseXY[1],
		stroke, strokeDasharray, opacity,
	};
	var x = snapX ? Math.round(xScale(xAccessor(currentItem))) : mouseXY[0];

	var line2 = {
		x1: x,
		x2: x,
		y1: 0,
		y2: height,
		stroke, strokeDasharray, opacity,
	};
	return [line1, line2];
}

export default CrossHairCursor;
