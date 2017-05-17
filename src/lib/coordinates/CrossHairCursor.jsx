"use strict";

import React from "react";
import PropTypes from "prop-types";
import GenericComponent from "../GenericComponent";
import PureComponent from "../utils/PureComponent";

import { hexToRGBA, isDefined, isNotDefined, strokeDashTypes, getStrokeDasharray } from "../utils";

class CrossHairCursor extends PureComponent {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		var lines = helper(this.props, moreProps);

		if (isDefined(lines)) {

			var { margin, ratio } = this.context;
			var originX = 0.5 * ratio + margin.left;
			var originY = 0.5 * ratio + margin.top;

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(ratio, ratio);

			ctx.translate(originX, originY);

			lines.forEach(line => {
				const dashArray = getStrokeDasharray(line.strokeDasharray).split(",").map(d => +d);

				ctx.strokeStyle = hexToRGBA(line.stroke, line.opacity);
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
		var lines = helper(this.props, moreProps);

		if (isNotDefined(lines)) return null;

		return (
			<g className={`react-stockcharts-crosshair ${className}`}>
				{lines.map(({ strokeDasharray, ...rest }, idx) =>
					<line
						key={idx}
						strokeDasharray={getStrokeDasharray(strokeDasharray)}
						{...rest} />)}
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
	className: PropTypes.string,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
};

CrossHairCursor.contextTypes = {
	margin: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired,

	// xScale for getting update event upon pan end, this is needed to get past the PureComponent shouldComponentUpdate
	xScale: PropTypes.func.isRequired,
};

CrossHairCursor.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	strokeDasharray: "ShortDash",
	snapX: true,
};

function helper(props, { mouseXY, xScale, currentItem, show, height, width, xAccessor }) {
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
