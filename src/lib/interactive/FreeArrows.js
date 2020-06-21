import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop, strokeDashTypes } from "../utils";

import {
    getValueFromOverride,
    terminate,
    saveNodeType,
    isHoverForInteractiveType,
} from "./utils";

import EachFreeArrows from "./wrapper/EachFreeArrows";
import Arrows from "./components/Arrows";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

class FreeArrows extends Component {
    constructor(props) {
        super(props);

        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleDrawLine = this.handleDrawLine.bind(this);
        this.handleDragLine = this.handleDragLine.bind(this);
        this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

        this.terminate = terminate.bind(this);
        this.saveNodeType = saveNodeType.bind(this);

        this.getSelectionState = isHoverForInteractiveType("arrows").bind(this);

        this.state = {};
        this.nodes = [];
    }
    handleDragLine(index, newXYValue) {
        this.setState({
            override: {
                index,
                ...newXYValue,
            },
        });
    }
    handleDragLineComplete(moreProps) {
        const { override } = this.state;
        if (isDefined(override)) {
            const { arrows } = this.props;
            const newArrows = arrows.map((each, idx) =>
                idx === override.index
                    ? {
                          ...each,
                          start: [override.x1Value, override.y1Value],
                          end: [override.x2Value, override.y2Value],
                          selected: true,
                      }
                    : {
                          ...each,
                          selected: false,
                      }
            );

            this.setState(
                {
                    override: null,
                },
                () => {
                    this.props.onComplete(newArrows, moreProps);
                }
            );
        }
    }
    handleDrawLine(xyValue) {
        const { current } = this.state;
        if (isDefined(current) && isDefined(current.start)) {
            this.mouseMoved = true;
            this.setState({
                current: {
                    start: current.start,
                    end: xyValue,
                },
            });
        }
    }
    handleStart(xyValue, moreProps, e) {
        const { current } = this.state;

        if (isNotDefined(current) || isNotDefined(current.start)) {
            this.mouseMoved = false;

            this.setState(
                {
                    current: {
                        start: xyValue,
                        end: null,
                    },
                },
                () => {
                    this.props.onStart(moreProps, e);
                }
            );
        }
    }
    handleEnd(xyValue, moreProps, e) {
        const { current } = this.state;
        const { arrows, appearance, type } = this.props;
        if (this.mouseMoved && isDefined(current) && isDefined(current.start)) {

            const newArrows = [
                ...arrows.map((d) => ({ ...d, selected: false })),
                {
                    start: current.start,
                    end: xyValue,
                    selected: true,
                    appearance,
                    type,
                },
            ];
            this.setState(
                {
                    current: null,
                    arrows: newArrows,
                },
                () => {
                    this.props.onComplete(newArrows, moreProps, e);
                }
            );
        }
    }
    render() {
        const { appearance } = this.props;
        const { enabled, snap, shouldDisableSnap, snapTo, type } = this.props;
        const { currentPositionRadius, currentPositionStroke } = this.props;
        const {
            currentPositionstrokeOpacity,
            currentPositionStrokeWidth,
        } = this.props;
        const { hoverText, arrows } = this.props;
        const { current, override } = this.state;

        const tempLine =
            isDefined(current) && isDefined(current.end) ? (
                <Arrows
                    type={type}
                    noHover
                    x1Value={current.start[0]}
                    y1Value={current.start[1]}
                    x2Value={current.end[0]}
                    y2Value={current.end[1]}
                    stroke={getAppearance(type, appearance).stroke}
                    strokeWidth={getAppearance(type, appearance).strokeWidth}
                    strokeOpacity={getAppearance(type, appearance).strokeOpacity}
                />
            ) : null;

        return (
            <g>
                {arrows.map((each, idx) => {
                    const eachAppearance = isDefined(each.appearance)
                        ? { ...appearance, ...each.appearance }
                        : appearance;

                    const hoverTextWithDefault = {
                        ...FreeArrows.defaultProps.hoverText,
                        ...hoverText,
                    };

                    return (
                        <EachFreeArrows
                            key={idx}
                            ref={this.saveNodeType(idx)}
                            index={idx}
                            type={each.type}
                            selected={each.selected}
                            x1Value={getValueFromOverride(
                                override,
                                idx,
                                "x1Value",
                                each.start[0]
                            )}
                            y1Value={getValueFromOverride(
                                override,
                                idx,
                                "y1Value",
                                each.start[1]
                            )}
                            x2Value={getValueFromOverride(
                                override,
                                idx,
                                "x2Value",
                                each.end[0]
                            )}
                            y2Value={getValueFromOverride(
                                override,
                                idx,
                                "y2Value",
                                each.end[1]
                            )}
                            stroke={getAppearance(type, eachAppearance).stroke}
                            strokeWidth={
                                getAppearance(type, eachAppearance).strokeWidth
                            }
                            strokeOpacity={
                                getAppearance(type, eachAppearance)
                                    .strokeOpacity
                            }
                            strokeDasharray={
                                getAppearance(type, eachAppearance)
                                    .strokeDasharray
                            }
                            edgeStroke={eachAppearance.edgeStroke}
                            edgeFill={eachAppearance.edgeFill}
                            edgeStrokeWidth={eachAppearance.edgeStrokeWidth}
                            r={eachAppearance.r}
                            hoverText={hoverTextWithDefault}
                            onDrag={this.handleDragLine}
                            onDragComplete={this.handleDragLineComplete}
                            edgeInteractiveCursor="react-stockcharts-move-cursor"
                            lineInteractiveCursor="react-stockcharts-move-cursor"
                        />
                    );
                })}
                {tempLine}
                <MouseLocationIndicator
                    enabled={enabled}
                    snap={snap}
                    shouldDisableSnap={shouldDisableSnap}
                    snapTo={snapTo}
                    r={currentPositionRadius}
                    stroke={currentPositionStroke}
                    strokeOpacity={currentPositionstrokeOpacity}
                    strokeWidth={currentPositionStrokeWidth}
                    onMouseDown={this.handleStart}
                    onClick={this.handleEnd}
                    onMouseMove={this.handleDrawLine}
                />
            </g>
        );
    }
}

function getAppearance(type, props) {
    switch (type) {
        case "ARROW-OPEN": {
            return props.open;
        }
        case "ARROW-CLOSE": {
            return props.close;
        }
        case "ARROW": {
            return props.arrow;
        }
        default:
            return props.arrow;
    }
}

FreeArrows.propTypes = {
    snap: PropTypes.bool.isRequired,
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
    type: PropTypes.oneOf([
        "ARROW", // extends from -Infinity to +Infinity
        "ARROW-OPEN", // extends to +/-Infinity in one direction
        "ARROW-CLOSE", // extends between the set bounds
    ]),
    hoverText: PropTypes.object.isRequired,

    arrows: PropTypes.array.isRequired,

    appearance: PropTypes.shape({
        edgeStrokeWidth: PropTypes.number.isRequired,
        edgeFill: PropTypes.string.isRequired,
        edgeStroke: PropTypes.string.isRequired,
        arrow: PropTypes.shape({
            stroke: PropTypes.string.isRequired,
            strokeOpacity: PropTypes.number.isRequired,
            strokeWidth: PropTypes.number.isRequired,
            strokeDasharray: PropTypes.oneOf(strokeDashTypes),
        }),
        open: PropTypes.shape({
            stroke: PropTypes.string.isRequired,
            strokeOpacity: PropTypes.number.isRequired,
            strokeWidth: PropTypes.number.isRequired,
            strokeDasharray: PropTypes.oneOf(strokeDashTypes),
        }),
        close: PropTypes.shape({
            stroke: PropTypes.string.isRequired,
            strokeOpacity: PropTypes.number.isRequired,
            strokeWidth: PropTypes.number.isRequired,
            strokeDasharray: PropTypes.oneOf(strokeDashTypes),
        }),
    }).isRequired,
};

FreeArrows.defaultProps = {
    type: "ARROW",

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
    arrows: [],

    appearance: {
        arrow: {
            stroke: "#000000",
            strokeOpacity: 1,
            strokeWidth: 4,
            strokeDasharray: "Solid",
        },
        edgeStrokeWidth: 1,
        edgeFill: "#FFFFFF",
        edgeStroke: "#000000",
        r: 6,

        open: {
            stroke: "green",
            strokeOpacity: 1,
            strokeWidth: 4,
            strokeDasharray: "Solid",
        },
        close: {
            stroke: "red",
            strokeOpacity: 1,
            strokeWidth: 4,
            strokeDasharray: "Solid",
        },
    },
};

export default FreeArrows;
