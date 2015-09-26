"use strict";

import React from "react";
import d3 from "d3";
import wrap from "./wrap";

const Line = (props) => {
	var { stroke, fill, className } = props;

	className = className.concat((stroke) ? "" : " line-stroke");
	return <path d={Line.getPath(props)} stroke={stroke} fill={fill} className={className}/>;
};

Line.propTypes = {
	className: React.PropTypes.string,
	xScale: React.PropTypes.func.isRequired,
	yScale: React.PropTypes.func.isRequired,
	xAccessor: React.PropTypes.func.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	plotData: React.PropTypes.array.isRequired,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	type: React.PropTypes.string.isRequired,
};

Line.defaultProps = {
	className: "line ",
	fill: "none",
	stroke: "black"
};

Line.getPath = (props) => {
	var { plotData, xScale, yScale, xAccessor, yAccessor } = props;

	var dataSeries = d3.svg.line()
		.defined((d) =>(yAccessor(d) !== undefined))
		.x((d) => xScale(xAccessor(d)))
		.y((d) => yScale(yAccessor(d)));
	return dataSeries(plotData);
};

Line.drawOnCanvas = (props, ctx, xScale, yScale, plotData) => {
	var { xAccessor, yAccessor, stroke } = props;

	var path = Line.getPath(props);

	ctx.strokeStyle = stroke;
	ctx.beginPath();

	var begin = true;
	plotData.forEach((d) => {
		if (yAccessor(d) === undefined) {
			ctx.stroke();
			ctx.beginPath();
			begin = true;
		} else {
			if (begin) {
				begin = false;
				let [x, y] = [xScale(xAccessor(d)), yScale(yAccessor(d))];
				ctx.moveTo(x, y);
			}
			ctx.lineTo(xScale(xAccessor(d)), yScale(yAccessor(d)));
		}
	});
	ctx.stroke();
};

export default wrap(Line);
