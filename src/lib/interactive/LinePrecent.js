import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";

import { isDefined, isNotDefined, noop, strokeDashTypes } from "../utils";

import {
    getValueFromOverride,
    terminate,
    saveNodeType,
    isHoverForInteractiveType,
} from "./utils";

import EachLinePrecent from "./wrapper/EachLinePrecent";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";
class LinePrecent extends Component {
    constructor(props) {
        super(props);

        this.handleStart = this.handleStart.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleDrawLine = this.handleDrawLine.bind(this);
        this.handleDragLine = this.handleDragLine.bind(this);
        this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

        this.terminate = terminate.bind(this);
        this.saveNodeType = saveNodeType.bind(this);

        this.getSelectionState = isHoverForInteractiveType("percents").bind(
            this
        );

        this.state = {
            percent: ""
        };
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
            const { percents } = this.props;
            const newPercents = percents.map((each, idx) =>
                idx === override.index
                    ? {
                          ...each,
                          start: [override.x1Value, override.y1Value],
                          end: [override.x2Value, override.y2Value],
                          selected: true,
                          firstItem: override.firstItem,
                          lastItem: override.lastItem,
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
                    this.props.onComplete(newPercents, moreProps);
                }
            );
        }
    }
    handleDrawLine(xyValue, e, moreProps) {
        const { current } = this.state;
        const { percentFormat } = this.props;

        if (isDefined(current) && isDefined(current.start)) {
            this.mouseMoved = true;
            this.setState({
                current: {
                    ...current,
                    start: current.start,
                    end: xyValue,
                    lastItem: moreProps.currentItem,
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
                        ...current,
                        start: xyValue,
                        end: null,
                        firstItem: moreProps.currentItem,
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
        const { percents, appearance, type } = this.props;

        if (this.mouseMoved && isDefined(current) && isDefined(current.start)) {
            const newPercents = [
                ...percents.map((d) => ({ ...d, selected: false })),
                {
                    start: current.start,
                    end: xyValue,
                    selected: true,
                    appearance,
                    type,
                    firstItem: current.firstItem,
                    lastItem: moreProps.currentItem,
                },
            ];
            this.setState(
                {
                    current: null,
                    percents: newPercents,
                },
                () => {
                    this.props.onComplete(newPercents, moreProps, e);
                }
            );
        }
    }
    render() {
        const { appearance } = this.props;
        const { enabled, snap, shouldDisableSnap, snapTo } = this.props;
        const { currentPositionRadius, currentPositionStroke } = this.props;
        const {
            currentPositionstrokeOpacity,
            currentPositionStrokeWidth,
        } = this.props;
        const { hoverText, percents } = this.props;
        const { current, override } = this.state;


        const hoverTextWithDefault = {
            ...LinePrecent.defaultProps.hoverText,
            ...hoverText,
        };

        const tempLine =
            isDefined(current) && isDefined(current.end) ? (
                <g>
                    <EachLinePrecent
                        type="LINE"
                        noHover
                        x1Value={current.start[0]}
                        y1Value={current.start[1]}
                        x2Value={current.end[0]}
                        y2Value={current.end[1]}
                        stroke={appearance.stroke}
                        hoverText={hoverTextWithDefault}
                        strokeWidth={appearance.strokeWidth}
                        strokeOpacity={appearance.strokeOpacity}
                        fontSize={appearance.fontSize}
                        fontFill={appearance.fontFill}
                        fontFamily={appearance.fontFamily}
                        firstItem={current.firstItem}
                        lastItem={current.lastItem}
                        edgeStrokeWidth={appearance.edgeStrokeWidth}
                        edgeInteractiveCursor="react-stockcharts-move-cursor"
                        lineInteractiveCursor="react-stockcharts-move-cursor"
                        {...current}
                    />
                </g>
            ) : null;

        return (
            <g>
                {percents.map((each, idx) => {
                    const eachAppearance = isDefined(each.appearance)
                        ? { ...appearance, ...each.appearance }
                        : appearance;

                    return (
                        <EachLinePrecent
                            key={idx}
                            ref={this.saveNodeType(idx)}
                            index={idx}
                            type="LINE"
                            label={each.label} // TODO
                            selected={each.selected}
                            firstItem={each.firstItem}
                            lastItem={each.lastItem}
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
                            stroke={eachAppearance.stroke}
                            strokeWidth={eachAppearance.strokeWidth}
                            strokeOpacity={eachAppearance.strokeOpacity}
                            strokeDasharray={eachAppearance.strokeDasharray}
                            edgeStroke={eachAppearance.edgeStroke}
                            edgeFill={eachAppearance.edgeFill}
                            edgeStrokeWidth={eachAppearance.edgeStrokeWidth}
                            fontSize={eachAppearance.fontSize}
                            fontFill={eachAppearance.fontFill}
                            fontFamily={eachAppearance.fontFamily}
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

LinePrecent.propTypes = {
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

    hoverText: PropTypes.object.isRequired,

    percents: PropTypes.array.isRequired,

    appearance: PropTypes.shape({
        fontFamily: PropTypes.string.isRequired,
        fontSize: PropTypes.number.isRequired,
        fontFill: PropTypes.string.isRequired,
        stroke: PropTypes.string.isRequired,
        strokeOpacity: PropTypes.number.isRequired,
        strokeWidth: PropTypes.number.isRequired,
        strokeDasharray: PropTypes.oneOf(strokeDashTypes),
        edgeStrokeWidth: PropTypes.number.isRequired,
        edgeFill: PropTypes.string.isRequired,
        edgeStroke: PropTypes.string.isRequired,
    }).isRequired,
};

LinePrecent.defaultProps = {
    onStart: noop,
    onComplete: noop,
    onSelect: noop,

    currentPositionStroke: "#000000",
    currentPositionstrokeOpacity: 1,
    currentPositionStrokeWidth: 3,
    currentPositionRadius: 0,
    percentFormat: format(".2%"),

    shouldDisableSnap: (e) => e.button === 2 || e.shiftKey,
    hoverText: {
        ...HoverTextNearMouse.defaultProps,
        enable: true,
        bgHeight: "auto",
        bgWidth: "auto",
        text: "Click to select object",
        selectedText: "",
    },
    percents: [],

    appearance: {
        stroke: "#000000",
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeDasharray: "Solid",
        edgeStrokeWidth: 1,
        edgeFill: "#FFFFFF",
        edgeStroke: "#000000",
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        fontSize: 16,
        fontFill: "#000000",

        r: 6,
    },
};

export default LinePrecent;
