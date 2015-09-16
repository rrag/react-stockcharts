"use strict";

import React from "react";
import objectAssign from "object-assign"; // "../utils/Object.assign"

class EdgeCoordinate extends React.Component {

	render() {
		var { className } = this.props;

		var edge = EdgeCoordinate.helper(this.props);
		if (edge === null) return null;
		var line, coordinateBase, coordinate;

		if (edge.line !== undefined) {
			line = <line
					className="react-stockcharts-cross-hair" opacity={edge.line.opacity} stroke={edge.line.stroke}
					x1={edge.line.x1} y1={edge.line.y1}
					x2={edge.line.x2} y2={edge.line.y2} />
		}
		if (edge.coordinateBase !== undefined) {
			coordinateBase = <rect key={1} className="react-stockchart-text-background"
								x={edge.coordinateBase.edgeXRect}
								y={edge.coordinateBase.edgeYRect}
								height={edge.coordinateBase.rectHeight} width={edge.coordinateBase.rectWidth}
								fill={edge.coordinateBase.fill}  opacity={edge.coordinateBase.opacity} />
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
	type: React.PropTypes.oneOf(["vertical", "horizontal"]).isRequired,
	coordinate: React.PropTypes.any.isRequired,
	x1: React.PropTypes.number.isRequired,
	y1: React.PropTypes.number.isRequired,
	x2: React.PropTypes.number.isRequired,
	y2: React.PropTypes.number.isRequired,
	orient: React.PropTypes.oneOf(["bottom", "top", "left", "right"]),
	rectWidth: React.PropTypes.number,
	hideLine: React.PropTypes.bool,
	fill: React.PropTypes.string,
	opacity: React.PropTypes.number,
	fontFamily: React.PropTypes.string.isRequired,
	fontSize: React.PropTypes.number.isRequired,
};
EdgeCoordinate.defaultProps = {
	namespace: "ReStock.EdgeCoordinate",
	orient: "left",
	hideLine: false,
	fill: "#8a8a8a",
	opacity: 1,
	textFill: "white",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
};


EdgeCoordinate.helper = (props) => {
	var { coordinate: displayCoordinate, show, rectWidth, type, orient, edgeAt, hideLine, className } = props;
	var { fill, opacity, fontFamily, fontSize, textFill } = props;
	var { x1, y1, x2, y2 } = props;

	if (!show) return null;

	rectWidth = rectWidth ? rectWidth : (type === "horizontal") ? 60 : 100;
	var rectHeight = 20;

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
	if (displayCoordinate !== undefined) {
		coordinateBase = {
			edgeXRect, edgeYRect, rectHeight, rectWidth, fill, opacity
		};
		coordinate = {
			edgeXText, edgeYText, textAnchor, fontFamily, fontSize, textFill, displayCoordinate
		};
	}
	var line = hideLine ? undefined : {
		opacity: 0.3, stroke: "black", x1, y1, x2, y2
	}
	return {
		coordinateBase, coordinate, line
	}
}

EdgeCoordinate.drawOnCanvasStatic = (ctx, props) => {
	props = objectAssign({}, EdgeCoordinate.defaultProps, props);

	var edge = EdgeCoordinate.helper(props);

	if (edge === null) return;

	if (edge.coordinateBase !== undefined) {
		// var { globalAlpha, fillStyle } = ctx;
		ctx.globalAlpha = edge.coordinateBase.opacity;
		ctx.fillStyle = edge.coordinateBase.fill;

		ctx.beginPath();
		ctx.rect(edge.coordinateBase.edgeXRect, edge.coordinateBase.edgeYRect, edge.coordinateBase.rectWidth, edge.coordinateBase.rectHeight);
		ctx.fill();

		ctx.font = `${ edge.coordinate.fontSize }px ${edge.coordinate.fontFamily}`;
		ctx.fillStyle = edge.coordinate.textFill;
		ctx.textAlign = edge.coordinate.textAnchor === "middle" ? "center" : edge.coordinate.textAnchor;
		ctx.textBaseline = "middle";

		ctx.fillText(edge.coordinate.displayCoordinate, edge.coordinate.edgeXText, edge.coordinate.edgeYText); 
	}
	if (edge.line !== undefined) {
		ctx.globalAlpha = edge.line.opacity;
		ctx.strokeStyle = edge.line.stroke;

		ctx.beginPath();
		ctx.moveTo(edge.line.x1, edge.line.y1);
		ctx.lineTo(edge.line.x2, edge.line.y2);
		ctx.stroke();
	}
}
module.exports = EdgeCoordinate;
