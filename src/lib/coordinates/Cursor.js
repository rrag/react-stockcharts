import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent, { getMouseCanvas } from "../GenericComponent";

import { first, last, hexToRGBA, isDefined, isNotDefined, strokeDashTypes, getStrokeDasharray } from "../utils";

class Cursor extends Component {
    
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	
    getXCursorShape(props, moreProps, ctx) {

        const { height, xScale, currentItem, plotData } = moreProps;
        const { xAccessor } = moreProps;
        const xValue = xAccessor(currentItem);
        const centerX = xScale(xValue);
        const shapeWidth = Math.abs(xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)))) / (plotData.length - 1);
        const xPos = centerX - shapeWidth / 2;
        
        return { height, xPos, shapeWidth };
    }	
	
	drawOnCanvas(ctx, moreProps) {
	    
		const cursors = getXYCursor(this.props, moreProps);

		if (isDefined(cursors)) {

		    const { useXCursorShape } = this.props;
		    
			const { margin, ratio } = this.context;
			const originX = 0.5 * ratio + margin.left;
			const originY = 0.5 * ratio + margin.top;

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(ratio, ratio);

			ctx.translate(originX, originY);

			cursors.forEach(line => {
				const dashArray = getStrokeDasharray(line.strokeDasharray).split(",").map(d => +d);
				
				if( useXCursorShape && line.id == "xCursor" ) {
                    const { xCursorShapeFill, xCursorShapeOpacity, xCursorShapeStroke, xCursorShapeStrokeDasharray } = this.props;
                    const xShape = this.getXCursorShape(this.props, moreProps);

                    if(xCursorShapeStrokeDasharray != undefined) {
                        ctx.strokeStyle = hexToRGBA(xCursorShapeStroke, xCursorShapeOpacity);
                        ctx.setLineDash(getStrokeDasharray(xCursorShapeStrokeDasharray).split(",").map(d => +d));
                    }

                    ctx.beginPath();
                    ctx.fillStyle = hexToRGBA(xCursorShapeFill, xCursorShapeOpacity);
                    ctx.beginPath();
                    xCursorShapeStrokeDasharray == undefined ? 
                            ctx.fillRect(xShape.xPos, 0, xShape.shapeWidth, xShape.height) : 
                            ctx.rect(xShape.xPos, 0, xShape.shapeWidth, xShape.height);
                    ctx.fill();
				}
				else{
				    ctx.strokeStyle = hexToRGBA(line.stroke, line.opacity);
	                ctx.setLineDash(dashArray);
	                ctx.beginPath();
				    ctx.moveTo(line.x1, line.y1);
	                ctx.lineTo(line.x2, line.y2);
				}

				ctx.stroke();
			});

			ctx.restore();
		}
	}
	
	renderSVG(moreProps) {

		const cursors = getXYCursor(this.props, moreProps);
		if (isNotDefined(cursors)) return null;
		
		const { className, useXCursorShape } = this.props;

		return (
			<g className={`react-stockcharts-crosshair ${className}`}>
				{cursors.map(({ strokeDasharray, id, ...rest }, idx) => {
				    
				    if( useXCursorShape && id == "xCursor" ) {
				        const { xCursorShapeFill, xCursorShapeOpacity, xCursorShapeStroke, xCursorShapeStrokeDasharray } = this.props;
				        const xShape = this.getXCursorShape(this.props, moreProps);
				        return  <rect  
        				         key={idx} 
				             x={xShape.xPos} 
				             y={0} 
				             width={xShape.shapeWidth} 
				             height={xShape.height} 
				             fill={xCursorShapeFill} 
				             stroke={xCursorShapeStrokeDasharray == undefined ? null : xCursorShapeStroke} 
				             strokeDasharray={xCursorShapeStrokeDasharray == undefined ? null : getStrokeDasharray(xCursorShapeStrokeDasharray)} 
				             opacity={xCursorShapeOpacity} /> 
				    }
				    
				    return <line 
				         key={idx}
				         strokeDasharray={getStrokeDasharray(strokeDasharray)}
				         {...rest} />
				})}
			</g>
		);
	}
	
	render() {
		return <GenericComponent
			svgDraw={this.renderSVG}
			clip={false}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getMouseCanvas}
			drawOn={["mousemove", "pan", "drag"]}
		/>;
	}
}

Cursor.propTypes = {
    className: PropTypes.string,
    stroke: PropTypes.string,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	snapX: PropTypes.bool,
	opacity: PropTypes.number,
	disableYCursor: PropTypes.bool,
	useXCursorShape: PropTypes.bool,
	xCursorShapeFill: PropTypes.string,
	xCursorShapeStroke: PropTypes.string,
	xCursorShapeStrokeDasharray: PropTypes.oneOf(strokeDashTypes),
	xCursorShapeOpacity: PropTypes.number,
};

Cursor.contextTypes = {
	margin: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired,
	// xScale for getting update event upon pan end, this is needed to get past the PureComponent shouldComponentUpdate
	// xScale: PropTypes.func.isRequired,
};

function customX(props, moreProps) {
	const { xScale, xAccessor, currentItem, mouseXY } = moreProps;
	const { snapX } = props;
	const x = snapX
		? Math.round(xScale(xAccessor(currentItem)))
		: mouseXY[0];
	return x;
}

Cursor.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	strokeDasharray: "ShortDash",
	snapX: true,
	customX,
	disableYCursor: false,
	useXCursorShape: false,
	xCursorShapeStroke: "#000000",
	xCursorShapeFill: "#D4E2FD",
	xCursorShapeOpacity: 0.5,
};

function getXYCursor(props, moreProps) {

	const {
		mouseXY, currentItem, show, height, width
	} = moreProps;

	const { customX, stroke, opacity, strokeDasharray, disableYCursor } = props;

	if (!show || isNotDefined(currentItem)) return null;
	
	const yCursor = {
		x1: 0,
		x2: width,
		y1: mouseXY[1],
		y2: mouseXY[1],
		stroke, strokeDasharray, opacity,
		id: "yCursor"
	};
	const x = customX(props, moreProps);

	const xCursor = {
		x1: x,
		x2: x,
		y1: 0,
		y2: height,
		stroke, strokeDasharray, opacity,
		id: "xCursor"
	};
	return disableYCursor ? [xCursor] : [yCursor, xCursor];
}

export default Cursor;
