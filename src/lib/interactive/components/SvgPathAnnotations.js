import React, { Component } from "react";
import PropTypes from "prop-types";
import { functor } from "../utils";

class SvgPathAnnotation extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        const { onClick } = this.props;

        if (onClick) {
            const { xScale, yScale, datum } = this.props;
            onClick({ xScale, yScale, datum }, e);
        }
    }
    render() {
        const {
            className,
            stroke,
            opacity,
            fill,
            tooltip,
            path,
        } = this.props;

        return (
            <g className={className} onClick={this.handleClick}>
                <title>{tooltip}</title>
                <path
                    d={path}
                    stroke={stroke}
                    fill={fill}
                    opacity={opacity}
                />
            </g>
        );
    }
}

SvgPathAnnotation.propTypes = {
    className: PropTypes.string,
    path: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    stroke: PropTypes.string,
    fill: PropTypes.string,
    opacity: PropTypes.number,
};

SvgPathAnnotation.defaultProps = {
    className: "react-stockcharts-svgpathannotation",
    opacity: 1,
};

export default SvgPathAnnotation;
