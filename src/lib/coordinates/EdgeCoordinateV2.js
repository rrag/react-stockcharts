

import React from "react";

import { hexToRGBA, isDefined } from "../utils";

/* eslint-disable react/prop-types */
export function renderSVG(props) {
	const { className } = props;

	const edge = helper(props);
	if (edge === null) return null;
	let line, coordinateBase, coordinate;

	if (isDefined(edge.line)) {
		line = <line
			className="react-stockcharts-cross-hair" opacity={edge.line.opacity} stroke={edge.line.stroke}
			x1={edge.line.x1} y1={edge.line.y1}
			x2={edge.line.x2} y2={edge.line.y2} />;
	}
	if (isDefined(edge.coordinateBase)) {

		const { rectWidth, rectHeight, arrowWidth } = edge.coordinateBase;

		const path = edge.orient === "left"
			? `M0,0L0,${ rectHeight }L${ rectWidth },${ rectHeight }L${ rectWidth + arrowWidth },10L${ rectWidth },0L0,0L0,0`
			: `M0,${ arrowWidth }L${ arrowWidth },${ rectHeight }L${ rectWidth + arrowWidth },${ rectHeight }L${ rectWidth + arrowWidth },0L${ arrowWidth },0L0,${ arrowWidth }`;

		coordinateBase = edge.orient === "left" || edge.orient === "right"
			? <g transform={`translate(${edge.coordinateBase.edgeXRect},${edge.coordinateBase.edgeYRect})`}>
				<path d={path} key={1} className="react-stockchart-text-background"
					height={rectHeight} width={rectWidth}
					fill={edge.coordinateBase.fill} opacity={edge.coordinateBase.opacity} />
			</g>
			: <rect key={1} className="react-stockchart-text-background"
				x={edge.coordinateBase.edgeXRect}
				y={edge.coordinateBase.edgeYRect}
				height={rectHeight} width={rectWidth}
				fill={edge.coordinateBase.fill} opacity={edge.coordinateBase.opacity} />;

		coordinate = (<text key={2} x={edge.coordinate.edgeXText}
			y={edge.coordinate.edgeYText}
			textAnchor={edge.coordinate.textAnchor}
			fontFamily={edge.coordinate.fontFamily}
			fontSize={edge.coordinate.fontSize}
			dy=".32em" fill={edge.coordinate.textFill} >{edge.coordinate.displayCoordinate}</text>);
	}
	return (
		<g className={className}>
			{line}
			{coordinateBase}
			{coordinate}
		</g>
	);
}
/* eslint-enable react/prop-types */

function helper(props) {
	const { coordinate: displayCoordinate, show, type, orient, edgeAt, hideLine } = props;
	const { fill, opacity, fontFamily, fontSize, textFill, lineStroke, lineOpacity, arrowWidth } = props;
	const { rectWidth, rectHeight } = props;
	const { x1, y1, x2, y2, dx } = props;

	if (!show) return null;

	// rectWidth = rectWidth ? rectWidth : (type === "horizontal") ? 60 : 100;

	let edgeXRect, edgeYRect, edgeXText, edgeYText;

	if (type === "horizontal") {

		edgeXRect = dx + ((orient === "right") ? edgeAt + 1 : edgeAt - rectWidth - arrowWidth - 1);
		edgeYRect = y1 - (rectHeight / 2);
		edgeXText = dx + ((orient === "right") ? edgeAt + (rectWidth / 2) + arrowWidth : edgeAt - (rectWidth / 2) - arrowWidth);
		edgeYText = y1;
	} else {
		edgeXRect = x1 - (rectWidth / 2);
		edgeYRect = (orient === "bottom") ? edgeAt : edgeAt - rectHeight;
		edgeXText = x1;
		edgeYText = (orient === "bottom") ? edgeAt + (rectHeight / 2) : edgeAt - (rectHeight / 2);
	}
	let coordinateBase, coordinate;
	const textAnchor = "middle";
	if (isDefined(displayCoordinate)) {
		coordinateBase = {
			edgeXRect, edgeYRect, rectHeight, rectWidth, fill, opacity, arrowWidth
		};
		coordinate = {
			edgeXText, edgeYText, textAnchor, fontFamily, fontSize, textFill, displayCoordinate
		};
	}

	const line = hideLine ? undefined : {
		opacity: lineOpacity, stroke: lineStroke, x1, y1, x2, y2
	};
	return {
		coordinateBase, coordinate, line, orient
	};
}

export function drawOnCanvas(ctx, props) {
	const edge = helper(props);

	if (edge === null) return;

	if (isDefined(edge.coordinateBase)) {
		const { rectWidth, rectHeight, arrowWidth } = edge.coordinateBase;

		ctx.fillStyle = hexToRGBA(edge.coordinateBase.fill, edge.coordinateBase.opacity);

		const x = edge.coordinateBase.edgeXRect;
		const y = edge.coordinateBase.edgeYRect;

		ctx.beginPath();

		if (edge.orient === "right") {
			ctx.moveTo(x, y + rectHeight / 2);
			ctx.lineTo(x + arrowWidth, y);
			ctx.lineTo(x + rectWidth + arrowWidth, y);
			ctx.lineTo(x + rectWidth + arrowWidth, y + rectHeight);
			ctx.lineTo(x + arrowWidth, y + rectHeight);
			ctx.closePath();
		} else if (edge.orient === "left") {
			ctx.moveTo(x, y);
			ctx.lineTo(x + rectWidth, y);
			ctx.lineTo(x + rectWidth + arrowWidth, y + rectHeight / 2);
			ctx.lineTo(x + rectWidth, y + rectHeight);
			ctx.lineTo(x, y + rectHeight);
			ctx.closePath();
		} else {
			ctx.rect(x, y, rectWidth, rectHeight);
		}
		ctx.fill();

		ctx.font = `${ edge.coordinate.fontSize }px ${edge.coordinate.fontFamily}`;
		ctx.fillStyle = edge.coordinate.textFill;
		ctx.textAlign = edge.coordinate.textAnchor === "middle" ? "center" : edge.coordinate.textAnchor;
		ctx.textBaseline = "middle";

		ctx.fillText(edge.coordinate.displayCoordinate, edge.coordinate.edgeXText, edge.coordinate.edgeYText);
	}
	if (isDefined(edge.line)) {
		ctx.strokeStyle = hexToRGBA(edge.line.stroke, edge.line.opacity);

		ctx.beginPath();
		ctx.moveTo(edge.line.x1, edge.line.y1);
		ctx.lineTo(edge.line.x2, edge.line.y2);
		ctx.stroke();
	}
}

// export default EdgeCoordinate;
