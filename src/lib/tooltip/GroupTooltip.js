import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

import { functor } from "../utils";

class SingleTooltip extends Component {

    constructor( props ) {
        super( props );
        this.handleClick = this.handleClick.bind( this );
    }

    handleClick( e ) {
        const { onClick, forChart, options } = this.props;
        onClick( { chartId: forChart, ...options }, e );
    }

    /**
     * Renders the value next to the label.
     */
    renderValueNextToLabel() {
        const { origin, yLabel, yValue, labelFill, valueFill, withShape, fontSize, fontFamily } = this.props;

        return (
            <g transform={`translate(${origin[0]}, ${origin[1]})`} onClick={this.handleClick}>
                {withShape ? <rect x="0" y="-6" width="6" height="6" fill={valueFill} /> : null}
                <ToolTipText x={withShape ? 8 : 0} y={0} fontFamily={fontFamily} fontSize={fontSize}>
                    <ToolTipTSpanLabel fill={labelFill}>{yLabel}: </ToolTipTSpanLabel>
                    <tspan fill={valueFill}>{yValue}</tspan>
                </ToolTipText>
            </g>
        )
    }

    /**
     * Renders the value beneath the label.
     */
    renderValueBeneathToLabel() {
        const { origin, yLabel, yValue, labelFill, valueFill, withShape, fontSize, fontFamily } = this.props;

        return (
            <g transform={`translate(${origin[0]}, ${origin[1]})`} onClick={this.handleClick}>
                {withShape ? <line x1={0} y1={2} x2={0} y2={28} stroke={valueFill} strokeWidth="4px" /> : null}
                <ToolTipText x={5} y={11} fontFamily={fontFamily} fontSize={fontSize}>
                    <ToolTipTSpanLabel fill={labelFill}>{yLabel}</ToolTipTSpanLabel>
                    <tspan x="5" dy="15" fill={valueFill}>{yValue}</tspan>
                </ToolTipText>
            </g>
        )
    }

    /**
     * Renders the value next to the label. 
     * The parent component must have a "text"-element.
     */
    renderInline() {
        const { yLabel, yValue, labelFill, valueFill, fontSize, fontFamily } = this.props;

        return (
            <tspan onClick={this.handleClick} fontFamily={fontFamily} fontSize={fontSize}>
                <ToolTipTSpanLabel fill={labelFill}>{yLabel}:&nbsp;</ToolTipTSpanLabel>
                <tspan fill={valueFill}>{yValue}&nbsp;&nbsp;</tspan>
            </tspan>
        )
    }

    render() {

        const { layout } = this.props;
        let comp = null;

        switch ( layout ) {
            case "horizontal":
                comp = this.renderValueNextToLabel();
                break;
            case "horizontalRows":
                comp = this.renderValueBeneathToLabel();
                break;
            case "horizontalInline":
                comp = this.renderInline();
                break;
            case "vertical":
                comp = this.renderValueNextToLabel();
                break;
            case "verticalRows":
                comp = this.renderValueBeneathToLabel();
                break;
            default:
                comp = this.renderValueNextToLabel();
        }

        return comp;
    }
}

SingleTooltip.propTypes = {
    origin: PropTypes.array.isRequired,
    yLabel: PropTypes.string.isRequired,
    yValue: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    fontFamily: PropTypes.string,
    labelFill: PropTypes.string.isRequired,
    valueFill: PropTypes.string.isRequired,
    fontSize: PropTypes.number,
    withShape: PropTypes.bool,
    forChart: PropTypes.oneOfType( [PropTypes.number, PropTypes.string] ).isRequired,
    options: PropTypes.object.isRequired,
};

SingleTooltip.defaultProps = {
    labelFill: "#4682B4",
    valueFill: "#000000",
    withShape: false,
};

class GroupTooltip extends Component {
    constructor( props ) {
        super( props );
        this.renderSVG = this.renderSVG.bind( this );
    }
    
    // TODO: please implement this
    // the retuned x-y-array must have the right x and y
    // for the translate-property of the groupTooltip-component.
    getPosition(props) {
        const { position } = this.props;
        let xyPos = [];

        switch ( layout ) {
            case "topLeft":
                xyPos = [0, 0];
                break;
            case "topRight":
                xyPos = [0, 0];
                break;
            case "topCenter":
                xyPos = [0, 0];
                break;
            case "bottomLeft":
                xyPos = [0, 0];
                break;
            case "bottomRight":
                xyPos = [0, 0];
                break;
            case "bottomCenter":
                xyPos = [0, 0];
                break;
            default:
                xyPos = [0, 0];
        }

        return xyPos;
    }
    
    
    renderSVG( moreProps ) {

        const { displayValuesFor } = this.props;
        const { chartId } = moreProps;

        const { className, onClick, width, verticalSize, fontFamily, fontSize, layout } = this.props;
        const { origin, displayFormat, options } = this.props;
        const currentItem = displayValuesFor( this.props, moreProps );
        // TODO: implement this.getPosition(props)
        const xyPos = this.getPosition(props);

        const singleTooltip = options.map( ( each, idx ) => {

            const yValue = currentItem && each.yAccessor( currentItem );
            const yDisplayValue = yValue ? displayFormat( yValue ) : "n/a";

            const orig = () => {
                if ( layout == "horizontal" || layout == "horizontalRows" ) {
                    return [width * idx, 0];
                }
                if ( layout == "vertical" ) {
                    return [0, verticalSize * idx];
                }
                if ( layout == "verticalRows" ) {
                    return [0, verticalSize * 2.3 * idx];
                }
                return [0, 0];
            }

            return <SingleTooltip
                key={idx}
                layout={layout}
                origin={orig()}
                yLabel={each.yLabel}
                yValue={yDisplayValue}
                options={each}
                forChart={chartId}
                onClick={onClick}
                fontFamily={fontFamily}
                fontSize={fontSize}
                labelFill={each.labelFill}
                valueFill={each.valueFill}
                withShape={each.withShape}
            />;
        } );

        return (
            // TODO: use xyPos-array for transform-property
            <g transform={`translate(${origin[0]}, ${origin[1]})`} className={className}>
                {layout == "horizontalInline"
                    ? <ToolTipText x={0} y={0} fontFamily={fontFamily} fontSize={fontSize}>{singleTooltip}</ToolTipText>
                    : singleTooltip
                }
            </g>
        );
    }
    render() {
        return <GenericChartComponent
            clip={false}
            svgDraw={this.renderSVG}
            drawOn={["mousemove"]}
        />;
    }
}

GroupTooltip.propTypes = {
    className: PropTypes.string,
    layout: PropTypes.oneOf( [
        "horizontal",
        "horizontalRows",
        "horizontalInline",
        "vertical",
        "verticalRows"] ).isRequired,
    position: PropTypes.oneOf( [
        "topLeft",
        "topRight",
        "topCenter",
        "bottomLeft",
        "bottomRight",
        "bottomCenter"] ).isRequired,
    displayFormat: PropTypes.func.isRequired,
    origin: PropTypes.array.isRequired,
    displayValuesFor: PropTypes.func,
    onClick: PropTypes.func,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
    width: PropTypes.number, // "width" only be used, if layout is "horizontal" or "horizontalRows".
    verticalSize: PropTypes.number,  // "verticalSize" only be used, if layout is "vertical", "verticalRows".
    options: PropTypes.arrayOf( PropTypes.shape( {
        yLabel: PropTypes.oneOfType( [
            PropTypes.string,
            PropTypes.func] ).isRequired,
        yAccessor: PropTypes.func.isRequired,
        labelFill: PropTypes.string,
        valueFill: PropTypes.string,
        withShape: PropTypes.bool, // "withShape" is ignored, if layout is "horizontalInline" or "vertical".
    } ) ),
};

GroupTooltip.defaultProps = {
    className: "react-stockcharts-tooltip react-stockcharts-group-tooltip",
    layout: "horizontal",
    position: "topLeft",
    displayFormat: format( ".2f" ),
    displayValuesFor: displayValuesFor,
    origin: [0, 0],
    width: 60,
    verticalSize: 13,
};

export default GroupTooltip;
