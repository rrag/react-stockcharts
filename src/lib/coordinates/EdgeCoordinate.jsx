"use strict";

import React, { PropTypes, Component } from "react";

import { hexToRGBA, isDefined } from "../utils";

class EdgeCoordinate extends Component {

	render() {
		var { className } = this.props;

		var edge = EdgeCoordinate.helper(this.props);
		if (edge === null) return null;
		var line, coordinateBase, coordinate;

		if (isDefined(edge.line)) {
			line = <line
				className="react-stockcharts-cross-hair" opacity={edge.line.opacity} stroke={edge.line.stroke}
				x1={edge.line.x1} y1={edge.line.y1}
				x2={edge.line.x2} y2={edge.line.y2} />;
		}
		if (isDefined(edge.coordinateBase)) {
			coordinateBase = <rect key={1} className="react-stockchart-text-background"
				x={edge.coordinateBase.edgeXRect}
				y={edge.coordinateBase.edgeYRect}
				height={edge.coordinateBase.rectHeight} width={edge.coordinateBase.rectWidth}
				fill={edge.coordinateBase.fill}  opacity={edge.coordinateBase.opacity} />;

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
}

EdgeCoordinate.propTypes = {
	className: PropTypes.string,
	type: PropTypes.oneOf(["vertical", "horizontal"]).isRequired,
	coordinate: PropTypes.any.isRequired,
	x1: PropTypes.number.isRequired,
	y1: PropTypes.number.isRequired,
	x2: PropTypes.number.isRequired,
	y2: PropTypes.number.isRequired,
	orient: PropTypes.oneOf(["bottom", "top", "left", "right"]),
	rectWidth: PropTypes.number,
	hideLine: PropTypes.bool,
	fill: PropTypes.string,
	opacity: PropTypes.number,
	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	rectHeight: PropTypes.number.isRequired,
};

EdgeCoordinate.defaultProps = {
	className: "react-stockcharts-edgecoordinate",
	orient: "left",
	hideLine: false,
	fill: "#8a8a8a",
	opacity: 1,
	textFill: "#FFFFFF",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	lineStroke: "#000000",
	lineOpacity: 0.3,
	rectHeight: 20,
};


EdgeCoordinate.helper = (props) => {
	var { coordinate: displayCoordinate, show, rectWidth, type, orient, edgeAt, hideLine } = props;
	var { fill, opacity, fontFamily, fontSize, textFill, lineStroke, lineOpacity, rectHeight } = props;
	var { x1, y1, x2, y2 } = props;

	if (!show) return null;

	rectWidth = rectWidth ? rectWidth : (type === "horizontal") ? 60 : 100;

	var edgeXRect, edgeYRect, edgeXText, edgeYText;

	if (type === "horizontal") {

		edgeXRect = (orient === "right") ? edgeAt + 1 : edgeAt - rectWidth - 1;
		edgeYRect = y1 - (rectHeight / 2);
		edgeXText = (orient === "right") ? edgeAt + (rectWidth / 2) : edgeAt - (rectWidth / 2);
		edgeYText = y1;
	} else {
		edgeXRect = x1 - (rectWidth / 2);
		edgeYRect = (orient === "bottom") ? edgeAt : edgeAt - rectHeight;
		edgeXText = x1;
		edgeYText = (orient === "bottom") ? edgeAt + (rectHeight / 2) : edgeAt - (rectHeight / 2);
	}
	var coordinateBase, coordinate, textAnchor = "middle";
	if (isDefined(displayCoordinate)) {
		coordinateBase = {
			edgeXRect, edgeYRect, rectHeight, rectWidth, fill, opacity
		};
		coordinate = {
			edgeXText, edgeYText, textAnchor, fontFamily, fontSize, textFill, displayCoordinate
		};
	}
	var line = hideLine ? undefined : {
		opacity: lineOpacity, stroke: lineStroke, x1, y1, x2, y2
	};
	return {
		coordinateBase, coordinate, line
	};
};

EdgeCoordinate.drawOnCanvasStatic = (ctx, props) => {
	props = { ...EdgeCoordinate.defaultProps, ...props };

	var edge = EdgeCoordinate.helper(props);

	if (edge === null) return;

	if (isDefined(edge.coordinateBase)) {
		ctx.fillStyle = hexToRGBA(edge.coordinateBase.fill, edge.coordinateBase.opacity);

		ctx.beginPath();
		ctx.rect(edge.coordinateBase.edgeXRect, edge.coordinateBase.edgeYRect, edge.coordinateBase.rectWidth, edge.coordinateBase.rectHeight);
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
};

export default EdgeCoordinate;
