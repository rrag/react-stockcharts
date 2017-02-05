import React, { PropTypes, Component } from "react";

import { isDefined, head, last, noop } from "../utils";
import { getCurrentItem } from "../utils/ChartDataUtil";

import { getNewXY } from "./InteractiveLine";
import StraightLine, { generateLine } from "./StraightLine";
import ClickableCircle from "./ClickableCircle";
import Text from "./Text";

class EachFibRetracement extends Component {
	constructor(props) {
		super(props);

		this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
		this.handleEdge2Drag = this.handleEdge2Drag.bind(this);

		this.handleLineNSResizeTop = this.handleLineNSResizeTop.bind(this);
		this.handleLineNSResizeBottom = this.handleLineNSResizeBottom.bind(this);
		this.handleLineMove = this.handleLineMove.bind(this);

		this.handleLineDragStart = this.handleLineDragStart.bind(this);
		this.handleDragComplete = this.handleDragComplete.bind(this);

		this.handleHover = this.handleHover.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleUnSelect = this.handleUnSelect.bind(this);

		this.unselectCounter = 0;
		this.state = {
			selected: false,
			hover: false,
		};
	}
	handleHover(moreProps) {
		if (this.state.hover !== moreProps.hovering) {
			this.setState({
				hover: moreProps.hovering
			});
		}
	}
	handleSelect() {
		this.setState({
			selected: true
		});
	}
	handleUnSelect() {
		this.unselectCounter++;
		if (this.unselectCounter === 6) {
			this.setState({
				selected: false
			});
		}
		if (isDefined(this.timeoutId)) {
			clearTimeout(this.timeoutId);
		}

		this.timeoutId = setTimeout(() => {
			this.unselectCounter = 0;
		}, 100);
	}
	handleLineDragStart() {
		const {
			x1, y1, x2, y2,
		} = this.props;

		this.dragStart = {
			x1, y1, x2, y2,
		};
	}
	handleLineMove(moreProps) {
		const { index, onDrag } = this.props;

		const {
			x1: x1Value, y1: y1Value, x2: x2Value, y2: y2Value,
		} = this.dragStart;

		const { xScale, chartConfig: { yScale }, xAccessor, fullData } = moreProps;
		const { startPos, mouseXY } = moreProps;

		const x1 = xScale(x1Value);
		const y1 = yScale(y1Value);
		const x2 = xScale(x2Value);
		const y2 = yScale(y2Value);

		const dx = startPos[0] - mouseXY[0];
		const dy = startPos[1] - mouseXY[1];

		const newX1Value = xAccessor(getCurrentItem(xScale, xAccessor, [x1 - dx, y1 - dy], fullData));
		const newY1Value = yScale.invert(y1 - dy);
		const newX2Value = xAccessor(getCurrentItem(xScale, xAccessor, [x2 - dx, y2 - dy], fullData));
		const newY2Value = yScale.invert(y2 - dy);

		onDrag(index, {
			x1: newX1Value,
			y1: newY1Value,
			x2: newX2Value,
			y2: newY2Value,
		});
	}
	handleLineNSResizeTop(moreProps) {
		const { index, onDrag } = this.props;
		const {
			x1, x2, y2,
		} = this.props;

		const [, y1] = getNewXY(moreProps);

		onDrag(index, {
			x1,
			y1,
			x2,
			y2,
		});
	}
	handleLineNSResizeBottom(moreProps) {
		const { index, onDrag } = this.props;
		const {
			x1, y1, x2,
		} = this.props;

		const [, y2] = getNewXY(moreProps);

		onDrag(index, {
			x1,
			y1,
			x2,
			y2,
		});
	}
	handleEdge1Drag(moreProps) {
		const { index, onDrag } = this.props;
		const {
			y1, x2, y2,
		} = this.props;

		const [x1] = getNewXY(moreProps);

		onDrag(index, {
			x1,
			y1,
			x2,
			y2,
		});
	}
	handleEdge2Drag(moreProps) {
		const { index, onDrag } = this.props;
		const {
			x1, y1, y2,
		} = this.props;

		const [x2] = getNewXY(moreProps);

		onDrag(index, {
			x1,
			y1,
			x2,
			y2,
		});
	}
	handleDragComplete() {
		const { onDragComplete } = this.props;
		onDragComplete();
	}
	render() {
		const { x1, x2, y1, y2 } = this.props;
		const { interactive, yDisplayFormat, type } = this.props;
		const { stroke, strokeWidth, opacity } = this.props;
		const { fontFamily, fontSize, fontStroke } = this.props;
		const { edgeStroke, edgeFill, edgeStrokeWidth, r } = this.props;
		const { selected, hover } = this.state;
		const lines = helper({ x1, x2, y1, y2 });

		const lineType = type === "EXTEND" ? "XLINE" : "LINE";
		const dir = head(lines).y1 > last(lines).y1 ? 3 : -1.3;

		return <g>
			{lines.map((line, j) => {
				const text = `${yDisplayFormat(line.y)} (${line.percent.toFixed(2)}%)`;

				const xyProvider = ({ xScale, chartConfig, xAccessor, plotData }) => {
					const { x1, y1, x2 } = generateLine(lineType,
						[line.x1, line.y],
						[line.x2, line.y],
						xAccessor,
						plotData);

					const x = xScale(Math.min(x1, x2)) + 10;
					const y = chartConfig.yScale(y1) + dir * 4;
					return [x, y];
				};

				const firstOrLast = (j === 0) || (j === lines.length - 1);

				const interactiveCursorClass = firstOrLast
					? "react-stockcharts-ns-resize-cursor"
					: "react-stockcharts-move-cursor";

				const dragHandler = j === 0
					? this.handleLineNSResizeTop
					: j === lines.length - 1
						? this.handleLineNSResizeBottom
						: this.handleLineMove;

				const hoverHandler = interactive
					? { onHover: this.handleHover, onBlur: this.handleHover }
					: {};
				return <g key={j}>
					<StraightLine
						selected={selected}

						{...hoverHandler}
						onClick={this.handleSelect}
						onClickOutside={this.handleUnSelect}

						type={lineType}
						x1Value={line.x1}
						y1Value={line.y}
						x2Value={line.x2}
						y2Value={line.y}
						stroke={stroke}
						strokeWidth={(hover || selected) ? strokeWidth + 1 : strokeWidth}
						opacity={opacity}
						interactiveCursorClass={interactiveCursorClass}

						onDragStart={this.handleLineDragStart}
						onDrag={dragHandler}
						onDragComplete={this.handleDragComplete}
						/>
					<Text
						selected={selected}
						xyProvider={xyProvider}
						fontFamily={fontFamily}
						fontSize={fontSize}
						fill={fontStroke}>{text}</Text>
					<ClickableCircle
						show={selected}
						cx={line.x1}
						cy={line.y}
						r={r}
						fill={edgeFill}
						stroke={edgeStroke}
						strokeWidth={edgeStrokeWidth}
						opacity={1}
						interactiveCursorClass="react-stockcharts-ew-resize-cursor"
						onDrag={this.handleEdge1Drag}
						onDragComplete={this.handleDragComplete} />
					<ClickableCircle
						show={selected}
						cx={line.x2}
						cy={line.y}
						r={r}
						fill={edgeFill}
						stroke={edgeStroke}
						strokeWidth={edgeStrokeWidth}
						opacity={1}
						interactiveCursorClass="react-stockcharts-ew-resize-cursor"
						onDrag={this.handleEdge2Drag}
						onDragComplete={this.handleDragComplete} />


				</g>;
			})}
		</g>;
	}
}


function helper({ x1, y1, x2, y2 }) {
	const dy = y2 - y1;
	const retracements = [100, 61.8, 50, 38.2, 23.6, 0]
		.map(each => ({
			percent: each,
			x1,
			x2,
			y: (y2 - (each / 100) * dy),
		}));

	return retracements;
}

EachFibRetracement.propTypes = {
	x1: PropTypes.any.isRequired,
	x2: PropTypes.any.isRequired,
	y1: PropTypes.number.isRequired,
	y2: PropTypes.number.isRequired,

	yDisplayFormat: PropTypes.func.isRequired,
	type: PropTypes.string.isRequired,

	stroke: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,

	fontFamily: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	fontStroke: PropTypes.string.isRequired,

	interactive: PropTypes.bool.isRequired,

	r: PropTypes.number.isRequired,
	edgeFill: PropTypes.string.isRequired,
	edgeStroke: PropTypes.string.isRequired,
	edgeStrokeWidth: PropTypes.number.isRequired,

	index: PropTypes.number,
	onDrag: PropTypes.func.isRequired,
	onDragComplete: PropTypes.func.isRequired,
};

EachFibRetracement.defaultProps = {
	yDisplayFormat: d => d.toFixed(2),
	interactive: true,
	edgeStroke: "#000000",
	edgeFill: "#FFFFFF",
	edgeStrokeWidth: 1,
	r: 5,
	onDrag: noop,
	onDragComplete: noop,
};

export default EachFibRetracement;