"use strict";

import React, { PropTypes, Component } from "react";
import LineSeries from "./LineSeries";
import StraightLine from "./StraightLine";

class RSISeries extends Component {
	render() {
		var { className, calculator, stroke, type } = this.props;
		var yAccessor = calculator.accessor();
		var overSold = calculator.overSold();
		var middle = calculator.middle();
		var overBought = calculator.overBought();

		return (
			<g className={className}>
				<LineSeries
					className={className}
					yAccessor={yAccessor}
					stroke={stroke.line} fill="none"
					type={type} />
				{getHorizontalLine(this.props, overSold, stroke.top)}
				{getHorizontalLine(this.props, middle, stroke.middle)}
				{getHorizontalLine(this.props, overBought, stroke.bottom)}
			</g>
		);
	}
}

function getHorizontalLine(props, yValue, stroke) {

	return <StraightLine
		stroke={stroke} opacity={0.3}
		yValue={yValue} />;
}

RSISeries.propTypes = {
	className: PropTypes.string,

	calculator: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]).isRequired,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	xAccessor: PropTypes.func,
	plotData: PropTypes.array,
	stroke: PropTypes.object,
	type: PropTypes.string,
};

RSISeries.defaultProps = {
	className: "react-stockcharts-rsi-series",
	stroke: {
		line: "#000000",
		top: "#964B00",
		middle: "#000000",
		bottom: "#964B00"
	}
};

export default RSISeries;
