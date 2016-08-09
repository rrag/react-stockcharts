import React, { PropTypes, Component } from "react";
import d3 from "d3";

import GenericChartComponent from "../GenericChartComponent";

import { d3Window, MOUSEMOVE, MOUSEUP } from "../utils";
import { head, last, noop } from "../utils";
import { getCurrentItem } from "../utils/ChartDataUtil";

class InteractiveLine extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);

		this.handleEdgeDrag1 = this.handleEdgeDrag1.bind(this);
		this.handleEdgeDrag2 = this.handleEdgeDrag2.bind(this);
		this.handleEdgeDragEnd = this.handleEdgeDragEnd.bind(this);
	}
	handleMouseDown(e) {
		e.preventDefault();

		var win = d3Window(this.refs.component.getRef("capture"));
		d3.select(win)
			.on(MOUSEMOVE, this.handleDrag)
			.on(MOUSEUP, this.handleDragEnd);

		var mouseXY = [e.pageX, e.pageY];

		var { x1Value, x2Value, y1Value, y2Value } = this.props;

		this.moveStartPosition = {
			mouseXY,
			x1Value, x2Value, y1Value, y2Value
		};
	}
	handleDrag() {
		var e = d3.event;
		var moreProps = this.refs.component.getMoreProps();
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;
		var { xAccessor } = this.context;

		var { mouseXY, x1Value, x2Value, y1Value, y2Value } = this.moveStartPosition;
		var x1 = xScale(x1Value);
		var y1 = yScale(y1Value);
		var x2 = xScale(x2Value);
		var y2 = yScale(y2Value);

		var newPos = [e.pageX, e.pageY];

		var dx = mouseXY[0] - newPos[0];
		var dy = mouseXY[1] - newPos[1];

		var newX1Value = xAccessor(getCurrentItem(xScale, xAccessor, [x1 - dx, y1 - dy], plotData));
		var newY1Value = yScale.invert(y1 - dy);
		var newX2Value = xAccessor(getCurrentItem(xScale, xAccessor, [x2 - dx, y2 - dy], plotData));
		var newY2Value = yScale.invert(y2 - dy);

		this.props.onDrag(this.props.index, {
			x1Value: newX1Value,
			y1Value: newY1Value,
			x2Value: newX2Value,
			y2Value: newY2Value,
		}, e);
	}
	handleDragEnd() {
		var e = d3.event;
		this.moveStartPosition = null;

		var win = d3Window(this.refs.component.getRef("capture"));

		d3.select(win)
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);

		this.props.onDragComplete(this.props.index, e);
	}
	handleEdgeDrag1(edge1, e) {
		var [newCX, newCY] = edge1;

		var moreProps = this.refs.component.getMoreProps();
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;
		var { xAccessor } = this.context;

		var { x2Value, y2Value } = this.props;

		var newXValue = xAccessor(getCurrentItem(xScale, xAccessor, [newCX, newCY], plotData));
		var newYValue = yScale.invert(newCY);

		this.props.onDrag(this.props.index, {
			x1Value: newXValue,
			y1Value: newYValue,
			x2Value,
			y2Value,
		}, e);
	}
	handleEdgeDrag2(edge2, e) {
		var [newCX, newCY] = edge2;

		var moreProps = this.refs.component.getMoreProps();
		var { xScale, chartConfig: { yScale }, plotData } = moreProps;
		var { xAccessor } = this.context;

		var { x1Value, y1Value } = this.props;

		var newXValue = xAccessor(getCurrentItem(xScale, xAccessor, [newCX, newCY], plotData));
		var newYValue = yScale.invert(newCY);

		this.props.onDrag(this.props.index, {
			x1Value,
			y1Value,
			x2Value: newXValue,
			y2Value: newYValue,
		}, e);
	}
	handleEdgeDragEnd(e) {
		this.props.onDragComplete(this.props.index, e);
	}
	renderSVG(moreProps) {
		var { x1Value, x2Value, y1Value, y2Value, withEdge, type } = this.props;
		var { defaultClassName, stroke, strokeWidth, opacity } = this.props;
		var { r, edgeFill, edgeStroke, edgeStrokeWidth } = this.props;

		var { xScale, chartConfig: { yScale }, plotData } = moreProps;
		var { xAccessor } = this.context;

		var modLine = generateLine(type,
			[x1Value, y1Value],
			[x2Value, y2Value], xAccessor, plotData);

		var x1 = xScale(modLine.x1);
		var y1 = yScale(modLine.y1);
		var x2 = xScale(modLine.x2);
		var y2 = yScale(modLine.y2);

		return <g ref="capture">
			<line
				x1={x1} y1={y1} x2={x2} y2={y2}
				stroke={stroke} strokeWidth={strokeWidth}
				opacity={opacity} />
			<line className={defaultClassName}
				onMouseDown={this.handleMouseDown}
				x1={x1} y1={y1} x2={x2} y2={y2}
				stroke={stroke} strokeWidth={8} opacity={0} />
			{withEdge ? <ClickableCircle className={defaultClassName}
				onDrag={this.handleEdgeDrag1}
				onDragEnd={this.handleEdgeDragEnd}
				cx={x1} cy={y1} r={r}
				fill={edgeFill} stroke={edgeStroke}
				strokeWidth={edgeStrokeWidth}
				hoverOpacity={1} /> : null }
			{withEdge ? <ClickableCircle className={defaultClassName}
				onDrag={this.handleEdgeDrag2}
				onDragEnd={this.handleEdgeDragEnd}
				cx={x2} cy={y2} r={r}
				fill={edgeFill} stroke={edgeStroke}
				strokeWidth={edgeStrokeWidth}
				hoverOpacity={1} /> : null }
		</g>;

	}
	render() {
		// console.log("FOO")
		return <GenericChartComponent ref="component"
			svgDraw={this.renderSVG}
			drawOnPan
			/>;
	}
}

function generateLine(type, start, end, xAccessor, plotData) {
	/* if (end[0] - start[0] === 0) {
		// vertical line
		throw new Error("Trendline cannot be a vertical line")
	} */
	var m /* slope */ = end[0] === start[0] ? 0 : (end[1] - start[1]) / (end[0] - start[0]);
	// console.log(end[0] - start[0], m)
	var b /* y intercept */ = -1 * m * end[0] + end[1];
	// y = m * x + b
	var x1 = type === "XLINE"
		? xAccessor(head(plotData))
		: start[0]; // RAY or LINE start is the same

	var y1 = m * x1 + b;

	var x2 = type === "XLINE"
		? xAccessor(last(plotData))
		: type === "RAY"
			? end[0] > start[0] ? xAccessor(last(plotData)) : xAccessor(head(plotData))
			: end[0];
	var y2 = m * x2 + b;
	return { x1, y1, x2, y2 };
}

InteractiveLine.propTypes = {
	x1Value: PropTypes.any.isRequired,
	x2Value: PropTypes.any.isRequired,
	y1Value: PropTypes.any.isRequired,
	y2Value: PropTypes.any.isRequired,

	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	type: PropTypes.oneOf([
		"XLINE", // extends from -Infinity to +Infinity
		"RAY", // extends to +/-Infinity in one direction
		"LINE", // extends between the set bounds
	]).isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	r: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	edgeFill: PropTypes.string.isRequired,
	defaultClassName: PropTypes.string,
	index: PropTypes.number,
	edgeStroke: PropTypes.string.isRequired,
	edgeStrokeWidth: PropTypes.number.isRequired,
	withEdge: PropTypes.bool.isRequired,
};

InteractiveLine.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,
	edgeStrokeWidth: 3,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	r: 10,
	withEdge: false,
};

InteractiveLine.contextTypes = {
	xAccessor: PropTypes.func.isRequired,
};

class ClickableCircle extends Component {
	constructor(props) {
		super(props);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.state = {
			hover: false,
		};
	}
	handleMouseEnter() {
		this.setState({
			hover: true,
		});
	}
	handleMouseLeave() {
		this.setState({
			hover: false,
		});
	}
	handleMouseDown(e) {
		e.preventDefault();

		var win = d3Window(this.refs.edge);
		d3.select(win)
			.on(MOUSEMOVE, this.handleDrag)
			.on(MOUSEUP, this.handleDragEnd);

		var mouseXY = [e.pageX, e.pageY];

		var { cx, cy } = this.props;

		this.moveStartPosition = {
			mouseXY,
			cx, cy,
		};
	}
	handleDrag() {
		var e = d3.event;
		var newPos = [e.pageX, e.pageY];

		var { mouseXY, cx, cy } = this.moveStartPosition;

		var dx = mouseXY[0] - newPos[0];
		var dy = mouseXY[1] - newPos[1];

		var newCX = cx - dx;
		var newCY = cy - dy;

		this.props.onDrag([newCX, newCY], e);
	}
	handleDragEnd() {
		var e = d3.event;
		this.moveStartPosition = null;

		var win = d3Window(this.refs.edge);

		d3.select(win)
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);

		this.props.onDragComplete(e);
	}
	render() {
		var { className, cx, cy, r, fill, stroke, strokeWidth, hoverOpacity } = this.props;
		var opacity = this.state.hover ? hoverOpacity : 0;
		return <circle ref="edge" className={className}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onMouseDown={this.handleMouseDown}
				cx={cx} cy={cy} r={r}
				fill={fill} stroke={stroke}
				strokeWidth={strokeWidth}
				opacity={opacity} />;
	}
}

ClickableCircle.propTypes = {
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
	hoverOpacity: PropTypes.number.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	stroke: PropTypes.string.isRequired,
	fill: PropTypes.string.isRequired,
	r: PropTypes.number.isRequired,
	cx: PropTypes.number.isRequired,
	cy: PropTypes.number.isRequired,
	className: PropTypes.string.isRequired,
};


ClickableCircle.defaultProps = {
	onDrag: noop,
	onDragComplete: noop,
};


export default InteractiveLine;