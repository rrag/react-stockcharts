'use strict';

var React = require('react');
var d3 = require('d3');

function d3_scaleExtent(domain) {
	var start = domain[0], stop = domain[domain.length - 1];
	return start < stop ? [start, stop] : [stop, start];
}

function d3_scaleRange(scale) {
	return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
}

class AxisLine extends React.Component {
	render() {
		var { orient, scale, outerTickSize, fill, stroke, strokeWidth, className, shapeRendering } = this.props;
		var sign = orient === "top" || orient === "left" ? -1 : 1;

		var range = d3_scaleRange(scale);

		var d;

		if (orient === "bottom" || orient === "top") {
			d = "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize;
		} else {
			d = "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize;
		}

		return (
			<path
				className={className}
				shapeRendering={shapeRendering}
				d={d}
				fill={fill}
				stroke={stroke}
				strokeWidth={strokeWidth} >
			</path>
		);
	}
}

AxisLine.propTypes = {
	className: React.PropTypes.string,
	shapeRendering: React.PropTypes.string,
	orient: React.PropTypes.string.isRequired,
	scale: React.PropTypes.func.isRequired,
	outerTickSize: React.PropTypes.number,
	fill: React.PropTypes.string,
	stroke: React.PropTypes.string,
	strokeWidth: React.PropTypes.number,
};

AxisLine.defaultProps = {
	className: "react-stockcharts-axis-line",
	shapeRendering: "crispEdges",
	outerTickSize: 6,
	fill: "none",
	stroke: "#000",
	strokeWidth: 1,
};

module.exports = AxisLine;
