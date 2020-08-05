import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas } from "../../GenericComponent";

import { noop, hexToRGBA } from "../../utils";

class BackgroundHover extends Component {
    constructor(props) {
        super(props);
        this.saveNode = this.saveNode.bind(this);
        this.renderSVG = this.renderSVG.bind(this);
        this.drawOnCanvas = this.drawOnCanvas.bind(this);
        this.isHover = this.isHover.bind(this);
    }
    saveNode(node) {
        this.node = node;
    }
    isHover(moreProps) {
        const { rect } = helper(this.props, moreProps);
        const {
            mouseXY: [x, y],
        } = moreProps;

        if (
            x >= rect.x &&
            y >= rect.y &&
            x <= rect.x + rect.width &&
            y <= rect.y + rect.height
        ) {
            return true;
        }
        return false;
    }
    drawOnCanvas(ctx, moreProps) {
        const {  width, height } = this.props;

        const { rect } = helper(this.props, moreProps);

        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = hexToRGBA("#74b9ff", 0.3);

        ctx.beginPath();
        ctx.fillRect(rect.x, rect.y, width, height);
        ctx.setTransform(1, 1, 1, 1, 1, 0);

        ctx.beginPath();
        ctx.restore();
    }
    renderSVG(moreProps, e) {
        const { cx, cy, width, onHover, onUnHover, height, fill } = this.props;
        return (
            <g>
                <rect
                    fill="#e2e2e2"
                    x={cx}
                    y={cy}
                    width={width}
                    height={height}
                    onMouseMove={() => {
                        onHover(
                            { ...moreProps, hovering: true, show: true },
                            e
                        );
                    }}
                    onMouseEnter={() => {
                        onHover(
                            { ...moreProps, hovering: true, show: true },
                            e
                        );
                    }}
                    onMouseLeave={() => {
                        onUnHover(moreProps, e);
                    }}
                />
            </g>
        );
    }
    render() {
        const { interactiveCursorClass } = this.props;
        const { show } = this.props;
        const { onDragStart, onDrag, onDragComplete } = this.props;

        return show ? (
            <GenericChartComponent
                ref={this.saveNode}
                interactiveCursorClass={interactiveCursorClass}
                selected
                isHover={this.isHover}
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragComplete={onDragComplete}
                svgDraw={this.renderSVG}
                canvasDraw={this.drawOnCanvas}
                canvasToDraw={getMouseCanvas}
                drawOn={["pan", "mousemove", "drag"]}
            />
        ) : null;
    }
}

function helper(props, moreProps) {
    const { position, width, height } = props;

    const {
        xScale,
        chartConfig: { yScale },
    } = moreProps;

    const [xValue, yValue] = position;
    const x = xScale(xValue) - width / 2;
    const y = yScale(yValue) - height / 2;

    const rect = {
        x,
        y,
        width,
        height,
    };

    return {
        x,
        y,
        rect,
    };
}

BackgroundHover.propTypes = {
    onDragStart: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    onDragComplete: PropTypes.func.isRequired,
    fill: PropTypes.string.isRequired,

    cx: PropTypes.number,
    cy: PropTypes.number,

    className: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    strokeOpacity: PropTypes.number.isRequired,
    fillOpacity: PropTypes.number.isRequired,
    interactiveCursorClass: PropTypes.string,
};

BackgroundHover.defaultProps = {
    className: "react-stockcharts-interactive-line-edge",
    onDragStart: noop,
    onDrag: noop,
    onDragComplete: noop,
    onMove: noop,
    show: false,
    fillOpacity: 1,
    strokeOpacity: 1,
    fill: "#74b9ff",
};

export default BackgroundHover;
