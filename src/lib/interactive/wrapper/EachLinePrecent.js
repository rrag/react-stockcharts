import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";

import { ascending as d3Ascending } from "d3-array";
import { noop, strokeDashTypes } from "../../utils";
import { isNotDefined, saveNodeType, isHover } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";

import StraightLine, { generateLine } from "../components/StraightLine";
import ClickableCircle from "../components/ClickableCircle";
import HoverTextNearMouse from "../components/HoverTextNearMouse";
import Text from "../components/Text";

class EachLinePrecent extends Component {
    constructor(props) {
        super(props);

        this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
        this.handleEdge2Drag = this.handleEdge2Drag.bind(this);
        this.handleLineDragStart = this.handleLineDragStart.bind(this);
        this.handleLineDrag = this.handleLineDrag.bind(this);

        this.handleEdge1DragStart = this.handleEdge1DragStart.bind(this);
        this.handleEdge2DragStart = this.handleEdge2DragStart.bind(this);

        this.handleDragComplete = this.handleDragComplete.bind(this);

        this.handleHover = this.handleHover.bind(this);

        this.isHover = isHover.bind(this);
        this.saveNodeType = saveNodeType.bind(this);
        this.nodes = {};

        this.state = {
            hover: false,
            percent: "",
            move: false,
            Edge1DItem: this.props.firstItem,
            Edge2DItem: this.props.lastItem,
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            (prevState.Edge1DItem !== nextProps.firstItem ||
                prevState.Edge2DItem !== nextProps.lastItem) &&
            prevState.move === false
        ) {
            return {
                Edge1DItem: nextProps.firstItem,
                Edge2DItem: nextProps.lastItem,
            };
        }
        return prevState;
    }
    handleLineDragStart(coords, moreProps) {
		const { x1Value, y1Value, x2Value, y2Value } = this.props;
		console.log('drag')

        this.dragStart = {
            x1Value,
            y1Value,
            x2Value,
            y2Value,
        };
    }
    handleLineDrag(moreProps) {
        const { index, onDrag } = this.props;

        const { x1Value, y1Value, x2Value, y2Value } = this.dragStart;

		const { Edge1DItem, Edge2DItem } = this.state;

        const {
            xScale,
            chartConfig: { yScale },
            xAccessor,
			fullData,
			plotData,
        } = moreProps;
        const { startPos, mouseXY } = moreProps;

        const x1 = xScale(x1Value);
        const y1 = yScale(y1Value);
        const x2 = xScale(x2Value);
		const y2 = yScale(y2Value);

        const dx = startPos[0] - mouseXY[0];
        const dy = startPos[1] - mouseXY[1];

        const newX1Value = getXValue(
            xScale,
            xAccessor,
            [x1 - dx, y1 - dy],
            fullData
        );
        const newY1Value = yScale.invert(y1 - dy);
        const newX2Value = getXValue(
            xScale,
            xAccessor,
            [x2 - dx, y2 - dy],
            fullData
		);
        const newY2Value = yScale.invert(y2 - dy);

        onDrag(index, {
            x1Value: newX1Value,
            y1Value: newY1Value,
            x2Value: newX2Value,
            y2Value: newY2Value,
            firstItem: plotData.find((item) => item.idx.index === newX1Value),
            lastItem: plotData.find((item) => item.idx.index === newX2Value),
		});
		this.setState({
            anchor: "edge1",
			move: true,
			Edge1DItem: plotData.find((item) => item.idx.index === newX1Value),
            Edge2DItem: plotData.find((item) => item.idx.index === newX2Value),
        });
    }
    handleEdge1DragStart(moreProps) {
        this.setState({
            anchor: "edge2",
            move: true,
            Edge1DItem: moreProps.currentItem,
        });
    }
    handleEdge2DragStart(moreProps) {
        this.setState({
            anchor: "edge1",
            move: true,
            Edge2DItem: moreProps.currentItem,
        });
    }
    handleDragComplete(...rest) {
        this.setState({
            anchor: undefined,
            move: false,
        });
        this.props.onDragComplete(...rest);
    }
    handleEdge1Drag(moreProps) {
        const { index, onDrag } = this.props;
        const { x2Value, y2Value } = this.props;
        const { Edge1DItem, Edge2DItem } = this.state;

        const [x1Value, y1Value] = getNewXY(moreProps);

        onDrag(index, {
            x1Value,
            y1Value,
            x2Value,
            y2Value,
            firstItem: Edge1DItem,
            lastItem: Edge2DItem,
        });

        this.setState({
            move: true,
            Edge1DItem: moreProps.currentItem,
        });
    }
    handleEdge2Drag(moreProps) {
        const { index, onDrag } = this.props;
        const { x1Value, y1Value } = this.props;
        const [x2Value, y2Value] = getNewXY(moreProps);
        const { Edge1DItem, Edge2DItem } = this.state;

        onDrag(index, {
            x1Value,
            y1Value,
            x2Value,
            y2Value,
            firstItem: Edge1DItem,
            lastItem: Edge2DItem,
        });

        this.setState({
            move: true,
            Edge2DItem: moreProps.currentItem,
        });
    }
    handleHover(moreProps) {
        if (this.state.hover !== moreProps.hovering) {
            this.setState({
                hover: moreProps.hovering,
            });
        }
    }
    render() {
        const {
            x1Value,
            y1Value,
            x2Value,
            y2Value,
            type,
            stroke,
            strokeWidth,
            strokeOpacity,
            strokeDasharray,
            r,
            edgeStrokeWidth,
            edgeFill,
            edgeStroke,
            edgeInteractiveCursor,
            lineInteractiveCursor,
            hoverText,
            selected,
            fontSize,
            fontFill,
            fontFamily,
            onDragComplete,
        } = this.props;

        const {
            enable: hoverTextEnabled,
            selectedText: hoverTextSelected,
            text: hoverTextUnselected,
            ...restHoverTextProps
        } = hoverText;

        const percentFormat = format(".2%");

        const { hover, anchor } = this.state;
        const { Edge1DItem, Edge2DItem } = this.state;
        // const dir = head(lines).y1 > last(lines).y1 ? 3 : -1.3;

        const xyProvider = ({ xScale, chartConfig }) => {
            const { yScale } = chartConfig;
            const { x1, y1, x2, y2 } = generateLine({
                type: "LINE",
                start: [x1Value, y1Value],
                end: [x2Value, y2Value],
                xScale,
                yScale,
            });

            const x = xScale((x1 + x2) / 2) + 30;
            const y = yScale((y1 + y2) / 2) + 20;
            return [x, y];
        };
        return (
            <g>
                <StraightLine
                    ref={this.saveNodeType("line")}
                    selected={selected || hover}
                    onHover={this.handleHover}
                    onUnHover={this.handleHover}
                    x1Value={x1Value}
                    y1Value={y1Value}
                    x2Value={x2Value}
                    y2Value={y2Value}
                    type={type}
                    stroke={stroke}
                    strokeWidth={
                        hover || selected ? strokeWidth + 1 : strokeWidth
                    }
                    strokeOpacity={strokeOpacity}
                    strokeDasharray={strokeDasharray}
                    interactiveCursorClass={lineInteractiveCursor}
                    onDragStart={this.handleLineDragStart}
                    onDrag={this.handleLineDrag}
                    onDragComplete={onDragComplete}
                />
                <ClickableCircle
                    ref={this.saveNodeType("edge1")}
                    show={selected || hover}
                    cx={x1Value}
                    cy={y1Value}
                    r={r}
                    fill={edgeFill}
                    stroke={anchor === "edge1" ? stroke : edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    strokeOpacity={1}
                    interactiveCursorClass={edgeInteractiveCursor}
                    onDragStart={this.handleEdge1DragStart}
                    onDrag={this.handleEdge1Drag}
                    onDragComplete={this.handleDragComplete}
                />
                <ClickableCircle
                    ref={this.saveNodeType("edge2")}
                    show={selected || hover}
                    cx={x2Value}
                    cy={y2Value}
                    r={r}
                    fill={edgeFill}
                    stroke={anchor === "edge2" ? stroke : edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    strokeOpacity={1}
                    interactiveCursorClass={edgeInteractiveCursor}
                    onDragStart={this.handleEdge2DragStart}
                    onDrag={this.handleEdge2Drag}
                    onDragComplete={this.handleDragComplete}
                />
                <Text
                    selected={selected}
                    xyProvider={xyProvider}
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    fill={fontFill}
                >
                    {Edge1DItem && Edge2DItem
                        ? percentFormat(
                              (Edge1DItem.close - Edge2DItem.open) /
                                  Edge2DItem.open
                          )
                        : null}
						{/* {` P ${Edge1DItem && Edge2DItem
                        ?
                              (Edge1DItem.close - Edge2DItem.open).toFixed(2)

                        : null}`} */}
                </Text>
                <HoverTextNearMouse
                    show={hoverTextEnabled && hover}
                    {...restHoverTextProps}
                    text={selected ? hoverTextSelected : hoverTextUnselected}
                />
            </g>
        );
    }
}

export function getNewXY(moreProps) {
    const {
        xScale,
        chartConfig: { yScale },
        xAccessor,
        plotData,
        mouseXY,
    } = moreProps;
    const mouseY = mouseXY[1];

    const x = getXValue(xScale, xAccessor, mouseXY, plotData);

    const [small, big] = yScale.domain().slice().sort(d3Ascending);
    const y = yScale.invert(mouseY);
    const newY = Math.min(Math.max(y, small), big);

    return [x, newY];
}

function helper({ x1, y1, x2, y2 }) {
    const dy = y2 - y1;
    const retracements = [100, 61.8, 50, 38.2, 23.6, 0].map((each) => ({
        percent: each,
        x1,
        x2,
        y: y2 - (each / 100) * dy,
    }));

    return retracements;
}

EachLinePrecent.propTypes = {
    x1Value: PropTypes.any.isRequired,
    x2Value: PropTypes.any.isRequired,
    y1Value: PropTypes.any.isRequired,
    y2Value: PropTypes.any.isRequired,

    index: PropTypes.number,
    label: PropTypes.string.isRequired,

    type: PropTypes.oneOf(["LINE"]).isRequired,

    onDrag: PropTypes.func.isRequired,
    onEdge1Drag: PropTypes.func.isRequired,
    onEdge2Drag: PropTypes.func.isRequired,
    onDragComplete: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onUnSelect: PropTypes.func.isRequired,

    r: PropTypes.number.isRequired,
    strokeOpacity: PropTypes.number.isRequired,
    defaultClassName: PropTypes.string,

    selected: PropTypes.bool,

    stroke: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeDasharray: PropTypes.oneOf(strokeDashTypes),

    fontFamily: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    fontFill: PropTypes.string.isRequired,

    edgeStrokeWidth: PropTypes.number.isRequired,
    edgeStroke: PropTypes.string.isRequired,
    edgeInteractiveCursor: PropTypes.string.isRequired,
    lineInteractiveCursor: PropTypes.string.isRequired,
    edgeFill: PropTypes.string.isRequired,
    hoverText: PropTypes.object.isRequired,
};

EachLinePrecent.defaultProps = {
    onDrag: noop,
    onEdge1Drag: noop,
    onEdge2Drag: noop,
    onDragComplete: noop,
    onSelect: noop,
    onUnSelect: noop,

    selected: false,

    label: "5555%",

    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 16,
    fontFill: "#000000",

    edgeStroke: "#000000",
    edgeFill: "#FFFFFF",
    edgeStrokeWidth: 2,
    r: 5,
    strokeWidth: 1,
    strokeOpacity: 1,
    strokeDasharray: "Solid",
    hoverText: {
        enable: false,
    },
};

export default EachLinePrecent;
