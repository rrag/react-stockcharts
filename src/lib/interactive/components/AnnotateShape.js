import React, { Component } from "react";
import PropTypes from "prop-types";
import { isDefined, hexToRGBA } from "../../utils";
import SvgPath  from 'svg-path-to-canvas'

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import {
    helper,
    Circle,
    Reactangle,
    StarPath,
    ExclamationPath,
    LoverPath,
    CirclePath,
    ClosePath,
    PlusePath,
    HomePath,
    FlagPath,
    PencilPath,
    PinPath,
    SearchPath,
    FilterPath,
    CommandPath,
    CursorPath,
    CrescentPath,
    RightPath,
    TrapezePath,
    TrianglePath,
    PolygonPath,
    RectanglePath,
} from "./shapes";

class AnnotateShape extends Component {
    constructor(props) {
        super(props);
        this.renderSVG = this.renderSVG.bind(this);
        this.drawOnCanvas = this.drawOnCanvas.bind(this);
        this.isHover = this.isHover.bind(this);

        this.state = {
            hoverSVG: false,
        };
    }
    isHover(moreProps, e) {
        const { onHover, width } = this.props;
        if (isDefined(onHover)) {
            const { rect } = helper(this.props, moreProps);
            const {
                mouseXY: [x, y],
            } = moreProps;

            if (
                x >= rect.x - rect.width / 2 &&
                y >= rect.y - rect.height / 2 &&
                x <= rect.x + rect.width / 2 &&
                y <= rect.y + rect.height / 2
            ) {
                return true;
            }
        }
        return false;
    }

    drawOnCanvas(ctx, moreProps) {
        const { figure, width, height, degrees, fill, stroke } = this.props;

        const { x, y } = helper(this.props, moreProps);
        ctx.fillStyle = hexToRGBA(fill, 1);
        let pathData = "";

        switch (figure) {
            case "trapeze":
                pathData = TrapezePath(x, y, width, height, degrees);
                break;
            case "triangle":
                pathData = TrianglePath(x, y, width, height, degrees);
                break;
            case "polygon":
                pathData = PolygonPath(x, y, width, height, degrees);
                break;
            case "rectangle":
                pathData = RectanglePath(x, y, width, height, degrees);
                break;
            case "cursor":
                pathData = CursorPath(x, y, width, height, degrees);
                break;
            case "crescent":
                pathData = CrescentPath(x, y, width, height, degrees);
                break;
            case "right":
                pathData = RightPath(x, y, width, height, degrees);
                break;
            case "star":
                pathData = StarPath(x, y, width, height, degrees);
                break;
            case "exclamatio":
                pathData = ExclamationPath(x, y, width, height, degrees);
                break;
            case "lover":
                pathData = LoverPath(x, y, width, height, degrees);
                break;
            case "circle":
                pathData = CirclePath(x, y, width, height, degrees);
                break;
            case "close":
                pathData = ClosePath(x, y, width, height, degrees);
                break;
            case "pluse":
                pathData = PlusePath(x, y, width, height, degrees);
                break;
            case "home":
                pathData = HomePath(x, y, width, height, degrees);
                break;
            case "flag":
                pathData = FlagPath(x, y, width, height, degrees);
                break;
            case "pencil":
                pathData = PencilPath(x, y, width, height, degrees);
                break;
            case "pin":
                pathData = PinPath(x, y, width, height, degrees);
                break;
            case "search":
                pathData = SearchPath(x, y, width, height, degrees);
                break;
            case "filter":
                pathData = FilterPath(x, y, width, height, degrees);
                break;
            case "command":
                pathData = CommandPath(x, y, width, height, degrees);
                break;
            default:
                pathData = ExclamationPath(x, y, width, height, degrees);
        }

        const sp = new SvgPath(pathData);
        sp.save().beginPath().to(ctx).fill()
    }

    renderSVG(moreProps) {
        const { xAccessor } = moreProps;
        const {
            xScale,
            chartConfig: { yScale },
            plotData,
        } = moreProps;

        const {
            fill,
            degrees,
            width,
            height,
            onHover,
            interactiveCursorClass,
        } = this.props;

        const { x, y } = helper(this.props, moreProps);

        const { figure } = this.props;

        let pathData = "";

        switch (figure) {
            case "cursor":
                pathData = CursorPath(x, y, width, height, degrees);
                break;
            case "crescent":
                pathData = CrescentPath(x, y, width, height, degrees);
                break;
            case "right":
                pathData = RightPath(x, y, width, height, degrees);
                break;
            case "star":
                pathData = StarPath(x, y, width, height, degrees);
                break;
            case "exclamatio":
                pathData = ExclamationPath(x, y, width, height, degrees);
                break;
            case "lover":
                pathData = LoverPath(x, y, width, height, degrees);
                break;
            case "circle":
                pathData = CirclePath(x, y, width, height, degrees);
                break;
            case "close":
                pathData = ClosePath(x, y, width, height, degrees);
                break;
            case "pluse":
                pathData = PlusePath(x, y, width, height, degrees);
                break;
            case "home":
                pathData = HomePath(x, y, width, height, degrees);
                break;
            case "flag":
                pathData = FlagPath(x, y, width, height, degrees);
                break;
            case "pencil":
                pathData = PencilPath(x, y, width, height, degrees);
                break;
            case "pin":
                pathData = PinPath(x, y, width, height, degrees);
                break;
            case "search":
                pathData = SearchPath(x, y, width, height, degrees);
                break;
            case "filter":
                pathData = FilterPath(x, y, width, height, degrees);
                break;
            case "command":
                pathData = CommandPath(x, y, width, height, degrees);
                break;
            default:
                pathData = ExclamationPath(x, y, width, height, degrees);
        }

        return (
            <g
                className={`react-stockcharts-enable-interaction ${interactiveCursorClass}`}
                fill={fill}
            >
                <path
                    d={pathData}
                    onClick={() => console.log(111)}
                    onMouseMove={() => {
                        onHover(
                            { ...moreProps, hovering: true, show: true },
                        );
                    }}
                />
            </g>
        );
    }
    render() {
        const {
            interactiveCursorClass,
            selected,
            onDragStart,
            onDrag,
            onDragComplete,
            onHover,
            onUnHover,
        } = this.props;

        return (
            <GenericChartComponent
                isHover={this.isHover}
                svgDraw={this.renderSVG}
                canvasDraw={this.drawOnCanvas}
                canvasToDraw={getMouseCanvas}
                interactiveCursorClass={interactiveCursorClass}
                selected={selected}
                onDragStart={() => console.log('onDragStart')}
                onDrag={() => console.log('onDrag')}
                onDragComplete={onDragComplete}
                onHover={onHover}
                onUnHover={onUnHover}
                drawOn={["mousemove", "pan", "drag"]}
            />
        );
    }
}

AnnotateShape.propTypes = {
    className: PropTypes.string,
    usingProps: PropTypes.object,
    stroke: PropTypes.string.isRequired,
    fill: PropTypes.string.isRequired,
    opacity: PropTypes.number.isRequired,
};

AnnotateShape.defaultProps = {
    className: "react-stockcharts-annotate react-stockcharts-default-cursor",
    degrees: 0,
};

export default AnnotateShape;
