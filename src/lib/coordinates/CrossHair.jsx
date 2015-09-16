"use strict";

import React from "react";
import EdgeCoordinate from "./EdgeCoordinate";

import objectAssign from "object-assign"; // "../utils/Object.assign"

class CrossHair extends React.Component {
	shouldComponentUpdate(nextProps) {
		return nextProps.mouseXY !== this.props.mouseXY;
	}
	render() {
		var result = CrossHair.helper(this.props);
		var { line, edges } = result;
		var svgLine = line !== undefined
			? <line className="react-stockcharts-cross-hair" opacity={line.opacity} stroke={line.stroke}
					x1={line.x1} y1={line.y1}
					x2={line.x2} y2={line.y2} />
			: null;
		return (
			<g className="crosshair ">
				{svgLine}
				{edges.map((edge, idx) => <EdgeCoordinate
					key={idx}
					type={edge.type}
					className="horizontal"
					show={edge.show}
					x1={edge.x1} y1={edge.y1}
					x2={edge.x2} y2={edge.y2}
					coordinate={edge.coordinate}
					edgeAt={edge.edgeAt}
					orient={edge.orient}
					hideLine={edge.hideLine}
					/>)}
			</g>
		);
	}
}

CrossHair.propTypes = {
	yAxisPad: React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
	width: React.PropTypes.number.isRequired,
	mouseXY: React.PropTypes.array.isRequired,
	xDisplayValue: React.PropTypes.string.isRequired,
	edges: React.PropTypes.array.isRequired
};

CrossHair.defaultProps = {
	namespace: "ReStock.CrossHair",
	yAxisPad: 5
};

CrossHair.helper = (props) => {
	var { width, edges, yAxisPad, mouseXY, xDisplayValue, height } = props;
	var x1 = 0, x2 = width;

	var edges = edges.map((edge, idx) => {
		if (edge.at === "left") {
			x1 = -yAxisPad;
		}
		if (edge.at === "right") {
			x2 = width + yAxisPad;
		}
		return {
			type: "horizontal",
			show: true,
			x1: 0,
			y1: mouseXY[1],
			x2: 0,
			y2: mouseXY[1],
			coordinate: edge.yDisplayValue,
			edgeAt: (edge.at === "left" ? x1 : x2),
			orient: edge.at,
			hideLine: true
		}
	});
	edges.push({
		type: "vertical",
		show: true,
		x1: mouseXY[0],
		y1: 0,
		x2: mouseXY[0],
		y2: height,
		coordinate: xDisplayValue,
		edgeAt: height,
		orient: "bottom"
	});
	var line;
	if (edges.length > 1) {
		line = {
			opacity: 0.3,
			stroke: "black",
			x1: x1,
			y1: mouseXY[1],
			x2: x2,
			y2: mouseXY[1],
		};
	}
	return { edges, line };
}

CrossHair.drawOnCanvasStatic = (ctx, props) => {
	props = objectAssign({}, CrossHair.defaultProps, props);

	var result = CrossHair.helper(props);
	var { line, edges } = result;

	edges.forEach(edge => EdgeCoordinate.drawOnCanvasStatic(ctx, edge));

	if (line) {
		ctx.globalAlpha = line.opacity;
		ctx.strokeStype = line.stroke;

		ctx.beginPath();
		ctx.moveTo(line.x1, line.y1);
		ctx.lineTo(line.x2, line.y2);
		ctx.stroke();
	}
}

module.exports = CrossHair;
