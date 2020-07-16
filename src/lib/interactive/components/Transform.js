import React, { Component } from "react";
import PropTypes from "prop-types";

import { ascending as d3Ascending } from "d3-array";
import { noop } from "../../utils";
import { saveNodeType } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";

import ClickableCircle from "./ClickableCircle";
import ClickableRect from "./ClickableRect";
import BackgroundHover from "./BackgroundHover";
import AnnotateShape from "./AnnotateShape";

function pointDirection(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

class Transform extends Component {
    constructor(props) {
        super(props);

        this.handleEdgeBottomDragStart = this.handleEdgeBottomDragStart.bind(this);
        this.handleEdgeBottomDrag = this.handleEdgeBottomDrag.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);

        this.handleEdgeTopDragStart = this.handleEdgeTopDragStart.bind(this);
        this.handleEdgeTopDrag = this.handleEdgeTopDrag.bind(this);

        this.handleEdgeLeftDragStart = this.handleEdgeLeftDragStart.bind(this);
        this.handleEdgeLeftDrag = this.handleEdgeLeftDrag.bind(this);

        this.handleEdgeRightDragStart = this.handleEdgeRightDragStart.bind(
            this
        );
        this.handleEdgeRightDrag = this.handleEdgeRightDrag.bind(this);

        this.handleDragComplete = this.handleDragComplete.bind(this);

        this.saveNodeType = saveNodeType.bind(this);
        this.nodes = {};

        this.state = {
            anchor: undefined
        }
    }

    handleDragStart(moreProps) {
        const {
            position,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            appearance,
        } = this.props;
        const { mouseXY } = moreProps;
        const {
            chartConfig: { yScale },
            xScale,
        } = moreProps;
        const [mouseX, mouseY] = mouseXY;

        const [textCX, textCY] = position;
        const dx = mouseX - xScale(textCX);
        const dy = mouseY - yScale(textCY);

        const [rightCX, rightCY] = edgeRight;
        const dXR = mouseX - xScale(rightCX);
        const dYR = mouseY - yScale(rightCY);

        const [leftCX, leftCY] = edgeLeft;
        const dXL = mouseX - xScale(leftCX);
        const dYL = mouseY - yScale(leftCY);

        const [topCX, topCY] = edgeAngleTop;
        const dXT = mouseX - xScale(topCX);
        const dYT = mouseY - yScale(topCY);

        const [bottomCX, bottomY] = edgeAngleBottom;
        const dXB = mouseX - xScale(bottomCX);
        const dYB = mouseY - yScale(bottomY);

        this.dragStartPosition = {
            position,
            dx,
            dy,
            dXR,
            dYR,
            dXL,
            dYL,
            dXT,
            dYT,
            dXB,
            dYB,
        };
    }

    handleDrag(moreProps) {
        const { index, onDrag, width, height, degrees } = this.props;

        const {
            mouseXY: [, mouseY],
            chartConfig: { yScale },
            xAccessor,
            mouseXY,
            plotData,
            xScale,
        } = moreProps;

        const {
            dx,
            dy,
            dXR,
            dYR,
            dXL,
            dYL,
            dXT,
            dYT,
            dXB,
            dYB,
        } = this.dragStartPosition;
        const xValue = xScale.invert(
            xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dx
        );
        const xyValue = [xValue, yScale.invert(mouseY - dy)];

        // RIGHT
        const xRValue = xScale.invert(
            xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dXR
        );
        const xyRValue = [xRValue, yScale.invert(mouseY - dYR)];

        // LEFT
        const xLValue = xScale.invert(
            xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dXL
        );
        const xyLValue = [xLValue, yScale.invert(mouseY - dYL)];

        // TOP
        const xTValue = xScale.invert(
            xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dXT
        );
        const xyTValue = [xTValue, yScale.invert(mouseY - dYT)];

        // TOP
        const xBValue = xScale.invert(
            xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dXB
        );
        const xyBValue = [xBValue, yScale.invert(mouseY - dYB)];

        onDrag(index, xyValue, {
            width,
            height,
            edgeRight: xyRValue,
            edgeLeft: xyLValue,
            edgeAngleTop: xyTValue,
            edgeAngleBottom: xyBValue,
            degrees,
        });
    }
    handleEdgeLeftDragStart(moreProps) {
        const { position, edgeLeft } = this.props;
        const { mouseXY } = moreProps;
        const {
            chartConfig: { yScale },
            xScale,
        } = moreProps;
        const [mouseX, mouseY] = mouseXY;

        const [textCX, textCY] = edgeLeft;
        const dx = mouseX - xScale(textCX);
        const dy = mouseY - yScale(textCY);

        this.dragStartPosition = {
            edgeLeft,
            dx,
            dy,
        };
        this.setState({
            anchor: "edgeLeft",
        });
    }
    handleEdgeLeftDrag(moreProps) {
        const {
            index,
            position,
            width,
            onDrag,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            height,
            degrees,
        } = this.props;
        const {
            xScale,
            mouseXY: [mouseX, mouseY],
            chartConfig: { yScale },
            xAccessor,
            currentItem,
        } = moreProps;
        const { dx, dy } = this.dragStartPosition;

        const newWidth = Math.abs(xScale(position[0]) - mouseX  + width / 2);

        onDrag(index, position, {
            width: newWidth,
            height,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            degrees,
        });
    }

    handleEdgeRightDragStart(moreProps) {
        const { position, edgeRight } = this.props;
        const { mouseXY } = moreProps;
        const {
            chartConfig: { yScale },
            xScale,
        } = moreProps;
        const [mouseX, mouseY] = mouseXY;

        const [textCX, textCY] = edgeRight;
        const dx = mouseX - xScale(textCX);
        const dy = mouseY - yScale(textCY);

        this.dragStartPosition = {
            edgeRight,
            dx,
            dy,
        };
        this.setState({
            anchor: "edgeRight",
        });
    }
    handleEdgeRightDrag(moreProps) {
        const {
            index,
            position,
            width,
            onDrag,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            height,
            degrees,
        } = this.props;
        const {
            xScale,
            mouseXY: [mouseX, mouseY],
            chartConfig: { yScale },
            xAccessor,
            currentItem,
        } = moreProps;
        const { dx, dy } = this.dragStartPosition;

        const newWidth = Math.abs(mouseX - xScale(position[0]) + width / 2);

        onDrag(index, position, {
            width: newWidth,
            height,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            degrees,
        });
    }

    handleEdgeTopDragStart(moreProps) {
        this.setState({
            anchor: "edgeTop",
        });
    }
    handleEdgeBottomDragStart(moreProps) {
        this.setState({
            anchor: "edgeBottom",
        });
    }
    handleDragComplete(...rest) {
        this.setState({
            anchor: undefined,
        });
        this.props.onDragComplete(...rest);
    }
    handleEdgeTopDrag(moreProps) {
        const {
            index,
            position,
            width,
            onDrag,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            height,
            degrees,
        } = this.props;
        const {
            xScale,
            mouseXY: [mouseX, mouseY],
            chartConfig: { yScale },
            xAccessor,
            currentItem,
        } = moreProps;

        const newHeight = Math.abs(yScale(position[1]) - mouseY  + height / 2);
        const newDegrees = pointDirection(mouseX, mouseY, position[0], position[1])

        onDrag(index, position, {
            width: newHeight,
            height: newHeight,
            edgeRight,
            edgeLeft,
            degrees,
            edgeAngleTop,
            edgeAngleBottom,
        });
    }
    handleEdgeBottomDrag(moreProps) {
        const {
            index,
            position,
            width,
            onDrag,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            height,
            degrees,
        } = this.props;
        const {
            xScale,
            mouseXY: [mouseX, mouseY],
            chartConfig: { yScale },
            xAccessor,
            currentItem,
        } = moreProps;

        const newHeight = Math.abs(mouseY - yScale(position[1]) + height / 2);
        const newWidth = Math.abs(mouseY - yScale(position[1]) + width / 2);
        const newDegrees = pointDirection(mouseX, mouseY, position[0], position[1])

        onDrag(index, position, {
            width: newWidth,
            height: newHeight,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            degrees,
        });
    }

    render() {
        const {
            stroke,
            opacity,
            fill,
            r,
            edgeStrokeWidth,
            edgeFill,
            edgeStroke,
            edgeInteractiveCursor,
            hoverText,
            selected,
            position,
            width,
            height,
            degrees,
            figure,
            onHover,
            onUnHover,
        } = this.props;

        const {
            enable: hoverTextEnabled,
            selectedText: hoverTextSelected,
            text: hoverTextUnselected,
            ...restHoverTextProps
        } = hoverText;

        const { anchor } = this.state;

        return (
            <g transform={`rotate(${degrees} ${position[0]} ${position[1]})`}>
                <ClickableCircle
                    ref={this.saveNodeType("edgeTop")}
                    show={selected}
                    cx={position[0]}
                    cy={position[1]}
                    r={r}
                    fill={edgeFill}
                    stroke={anchor === "edgeTop" ? stroke : edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    strokeOpacity={1}
                    interactiveCursorClass={edgeInteractiveCursor}
                    placement="top"
                    width={width}
                    height={height}
                    onDragStart={this.handleEdgeTopDragStart}
                    onDrag={this.handleEdgeTopDrag}
                    onDragComplete={this.handleDragComplete}
                />
                <ClickableCircle
                    ref={this.saveNodeType("edgeBottom")}
                    show={selected}
                    cx={position[0]}
                    cy={position[1]}
                    r={r}
                    fill={edgeFill}
                    stroke={anchor === "edgeBottom" ? stroke : edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    strokeOpacity={1}
                    interactiveCursorClass={edgeInteractiveCursor}
                    placement="bottom"
                    width={width}
                    height={height}
                    onDragStart={this.handleEdgeBottomDragStart}
                    onDrag={this.handleEdgeBottomDrag}
                    onDragComplete={this.handleDragComplete}
                />
                <ClickableRect
                    ref={this.saveNodeType("edgeLeft")}
                    show={selected}
                    cx={position[0]}
                    cy={position[1]}
                    r={r}
                    fill={edgeFill}
                    stroke={anchor === "edgeLeft" ? stroke : edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    strokeOpacity={1}
                    placement="left"
                    width={width}
                    height={height}
                    interactiveCursorClass={edgeInteractiveCursor}
                    onDragStart={this.handleEdgeLeftDragStart}
                    onDrag={this.handleEdgeLeftDrag}
                    onDragComplete={this.handleDragComplete}
                />
                <ClickableRect
                    ref={this.saveNodeType("edgeRight")}
                    show={selected}
                    cx={position[0]}
                    cy={position[1]}
                    r={r}
                    placement="right"
                    width={width}
                    height={height}
                    fill={edgeFill}
                    stroke={anchor === "edgeRight" ? stroke : edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    strokeOpacity={1}
                    interactiveCursorClass={edgeInteractiveCursor}
                    onDragStart={this.handleEdgeRightDragStart}
                    onDrag={this.handleEdgeRightDrag}
                    onDragComplete={this.handleDragComplete}
                />
                <BackgroundHover
                    ref={this.saveNodeType("background")}
                    show={selected}
                    position={position}
                    fill={fill}
                    opacity={opacity}
                    width={width}
                    height={height}
                    degrees={degrees}
                    cx={position[0]}
                    cy={position[1]}
                    interactiveCursorClass="react-stockcharts-move-cursor"
                    onDragStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onDragComplete={this.handleDragComplete}
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

Transform.propTypes = {
    index: PropTypes.number,
    onDrag: PropTypes.func.isRequired,
    onDragComplete: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onUnSelect: PropTypes.func.isRequired,

    r: PropTypes.number.isRequired,
    defaultClassName: PropTypes.string,

    selected: PropTypes.bool,

    stroke: PropTypes.string.isRequired,
    fill: PropTypes.string.isRequired,

    edgeStrokeWidth: PropTypes.number.isRequired,
    edgeStroke: PropTypes.string.isRequired,
    edgeFill: PropTypes.string.isRequired,
    hoverText: PropTypes.object.isRequired,
};

Transform.defaultProps = {
    onDrag: noop,
    onEdge1Drag: noop,
    onEdge2Drag: noop,
    onDragComplete: noop,
    onSelect: noop,
    onUnSelect: noop,

    selected: false,
    fill: "#FFFFFF",
    stroke: "#000000",
    edgeStroke: "#000000",
    edgeFill: "#FFFFFF",
    edgeStrokeWidth: 2,
    r: 5,
    strokeWidth: 1,
    strokeOpacity: 1,
    hoverText: {
        enable: false,
    },
};

export default Transform;
