import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";

import { ascending as d3Ascending } from "d3-array";
import { noop, strokeDashTypes } from "../../utils";
import { isNotDefined, saveNodeType, isHover } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";

import StraightLine, { generateLine } from "../components/StraightLine";
import AnnotateShape from "../components/AnnotateShape";
import ClickableCircle from "../components/ClickableCircle";
import ClickableRect from "../components/ClickableRect";
import BackgroundHover from "../components/BackgroundHover";
import HoverTextNearMouse from "../components/HoverTextNearMouse";
import Transform from "../components/Transform";
import Text from "../components/Text";

class EachShape extends Component {
    constructor(props) {
        super(props);

        this.handleDragComplete = this.handleDragComplete.bind(this);

        this.handleHover = this.handleHover.bind(this);

        this.isHover = isHover.bind(this);
        this.saveNodeType = saveNodeType.bind(this);
        this.nodes = {};

        this.state = {
            hover: false,
        };
    }

    handleDragComplete(...rest) {
        this.setState({
            anchor: undefined,
        });
        this.props.onDragComplete(...rest);
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
            figure,
            position,
            onDragComplete,
            onDrag,
            lineInteractiveCursor,
            width,
            height,
            angle,
            edgeRight,
            edgeLeft,
            edgeAngleTop,
            edgeAngleBottom,
            id,
            index,
            degrees,
        } = this.props;

        const {
            enable: hoverTextEnabled,
            selectedText: hoverTextSelected,
            text: hoverTextUnselected,
            ...restHoverTextProps
        } = hoverText;

        const { hover, anchor } = this.state;
        return (
            <g>
                <Transform
                    figure={figure}
                    position={position}
                    stroke={stroke}
                    fill={fill}
                    index={index}
                    opacity={opacity}
                    degrees={degrees}
                    edgeRight={edgeRight}
                    edgeLeft={edgeLeft}
                    edgeAngleTop={edgeAngleTop}
                    edgeAngleBottom={edgeAngleBottom}
                    selected={selected || hover}
                    r={r}
                    position={position}
                    fill={fill}
                    opacity={opacity}
                    width={width}
                    height={height}
                    interactiveCursorClass="react-stockcharts-move-cursor"
                    onDrag={onDrag}
                    onDragComplete={onDragComplete}
                />
                <AnnotateShape
                    id={id}
                    ref={this.saveNodeType("shape")}
                    selected={selected || hover}
                    figure={figure}
                    position={position}
                    stroke={stroke}
                    fill={fill}
                    opacity={opacity}
                    degrees={degrees}
                    width={width}
                    height={height}
                    onHover={this.handleHover}
                    onUnHover={this.handleHover}
                    interactiveCursorClass="react-stockcharts-move-cursor"
                />
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

EachShape.propTypes = {
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
    edgeInteractiveCursor: PropTypes.string.isRequired,
    edgeFill: PropTypes.string.isRequired,
    hoverText: PropTypes.object.isRequired,
    lineInteractiveCursor: PropTypes.string.isRequired,
};

EachShape.defaultProps = {
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

export default EachShape;
