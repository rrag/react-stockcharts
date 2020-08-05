import React from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop, strokeDashTypes } from "../utils";
import {
    getValueFromOverride,
    terminate,
    saveNodeType,
    isHoverForInteractiveType,
} from "./utils";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

import SvgPathAnnotations from "./components/SvgPathAnnotations";
import EachShape from "./wrapper/EachShape";

class Shape extends React.Component {
    constructor() {
        super();
        this.handleDraw = this.handleDraw.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragComplete = this.handleDragComplete.bind(this);
        this.saveNodeType = saveNodeType.bind(this);
        this.getSelectionState = isHoverForInteractiveType("shapes").bind(this);

        this.nodes = [];
        this.state = {};
    }
    handleDrag(index, position, otherProps) {
        this.setState({
            override: {
                ...otherProps,
                index,
                position,
            },
        });
    }

    handleDragComplete(moreProps) {
        const { override } = this.state;
        if (isDefined(override)) {
            const { shapes } = this.props;
            const newTextList = shapes.map((each, idx) => {
                const selected = idx === override.index;
                return selected
                    ? {
                          ...each,
                          ...override,
                          position: override.position,
                          selected: true,
                      }
                    : {
                          ...each,
                          selected: false,
                      };
            });
            this.setState(
                {
                    override: null,
                },
                () => {
                    this.props.onDragComplete(newTextList, moreProps);
                }
            );
        }
    }

    handleDraw(moreProps, e) {
        const { enabled, shapes } = this.props;
        const {
            xScale,
            mouseXY: [mouseX, mouseY],
            chartConfig: { yScale },
            xAccessor,
            currentItem,
        } = moreProps;

        const xyValue = [xAccessor(currentItem), yScale.invert(mouseY)];

        const xylValue = []



        if (enabled) {
            const { defaultShape, onChoosePosition, figure } = this.props;

            const position = [xyValue[0], xyValue[1]];

            const newShape = {
                ...defaultShape,
                selected: true,
                figure,
                position,
                degrees: 0,
                width: 50,
                height: 50,
                edgeAngleTop: [xyValue[0], xyValue[1]],
                edgeAngleBottom: [xyValue[0], xyValue[1]],
                edgeRight: [xyValue[0], xyValue[1]],
                edgeLeft: [xyValue[0], xyValue[1]],
            };
            if (onChoosePosition) {
                onChoosePosition(newShape, moreProps, e);
            }
        } else {
            const newLabels = [
                ...shapes.map((d) => ({ ...d, selected: false })),
            ];
            this.props.onDragComplete(newLabels, moreProps);
        }
    }
    render() {
        const { hoverText, shapes } = this.props;
        const { override } = this.state;

        const hoverTextWithDefault = {
            ...Shape.defaultProps.hoverText,
            ...hoverText
        };

        return (
            <g>
                {shapes.map((shape, idx) => (
                    <EachShape
                        key={idx}
                        ref={this.saveNodeType(idx)}
                        index={idx}
                        fill={shape.fill}
                        stroke={shape.stroke}
                        figure={shape.figure}
                        position={getValueFromOverride(
                            override,
                            idx,
                            "position",
                            shape.position
                        )}
                        selected={shape.selected}
                        opacity={1}
                        degrees={getValueFromOverride(
                            override,
                            idx,
                            "degrees",
                            shape.degrees
                        )}
                        width={getValueFromOverride(
                            override,
                            idx,
                            "width",
                            shape.width
                        )}
                        height={getValueFromOverride(
                            override,
                            idx,
                            "height",
                            shape.height
                        )}
                        edgeAngleTop={getValueFromOverride(
                            override,
                            idx,
                            "edgeAngleTop",
                            shape.edgeAngleTop
                        )}
                        edgeAngleBottom={getValueFromOverride(
                            override,
                            idx,
                            "edgeAngleBottom",
                            shape.edgeAngleBottom
                        )}
                        edgeLeft={getValueFromOverride(
                            override,
                            idx,
                            "edgeLeft",
                            shape.edgeLeft
                        )}
                        edgeRight={getValueFromOverride(
                            override,
                            idx,
                            "edgeRight",
                            shape.edgeRight
                        )}
                        // edgeAngleTop={shape.edgeAngleTop}
                        // edgeAngleBottom={shape.edgeAngleBottom}
                        // edgeLeft={shape.edgeLeft}
                        // edgeRight={shape.edgeRight}
                        edgeInteractiveCursor="react-stockcharts-move-cursor"
                        lineInteractiveCursor="react-stockcharts-move-cursor"
                        onDrag={this.handleDrag}
                        onDragComplete={this.handleDragComplete}
					    hoverText={hoverTextWithDefault}
                        {...shape.appearance}
                    />
                ))}
                <GenericChartComponent
                    onClick={this.handleDraw}
                    svgDraw={noop}
                    canvasDraw={noop}
                    canvasToDraw={getMouseCanvas}
                    drawOn={["mousemove", "pan"]}
                />
            </g>
        );
    }
}

Shape.propTypes = {
    enabled: PropTypes.bool.isRequired,
    snapTo: PropTypes.func,
    shouldDisableSnap: PropTypes.func.isRequired,

    onStart: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    onDoubleClick: PropTypes.func,

    currentPositionStroke: PropTypes.string,
    currentPositionStrokeWidth: PropTypes.number,
    currentPositionstrokeOpacity: PropTypes.number,
    currentPositionRadius: PropTypes.number,

    hoverText: PropTypes.object.isRequired,

    shapes: PropTypes.array.isRequired,

    appearance: PropTypes.shape({
        stroke: PropTypes.string.isRequired,
        fill: PropTypes.string.isRequired,
        edgeStrokeWidth: PropTypes.number.isRequired,
        edgeFill: PropTypes.string.isRequired,
        edgeStroke: PropTypes.string.isRequired,
    }),
};

Shape.defaultProps = {
    onStart: noop,
    onComplete: noop,
    onSelect: noop,

    currentPositionStroke: "#000000",
    currentPositionstrokeOpacity: 1,
    currentPositionStrokeWidth: 3,
    currentPositionRadius: 0,

    shouldDisableSnap: (e) => e.button === 2 || e.shiftKey,
    hoverText: {
        ...HoverTextNearMouse.defaultProps,
        enable: true,
        bgHeight: "auto",
        bgWidth: "auto",
        text: "Click to select object",
        selectedText: "",
    },
    shapes: [],

    defaultShape: {
        appearance: {
            stroke: "#000000",
            fill: "#000000",
            edgeStrokeWidth: 1,
            edgeFill: "#FFFFFF",
            edgeStroke: "#000000",
            r: 6,
        },
    },
};

export default Shape;
