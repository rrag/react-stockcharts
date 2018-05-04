
import React from "react";
import PropTypes from "prop-types";

import LineSeries from "./LineSeries";
import AreaOnlySeries from "./AreaOnlySeries";
import { strokeDashTypes } from "../utils";

function AreaSeries(props) {
	const { yAccessor, baseAt } = props;
	const {
		className,
		opacity,
		stroke,
		strokeWidth,
		strokeOpacity,
		strokeDasharray,
		canvasGradient,
		fill,
		interpolation,
		style,
		canvasClip,
	} = props;

	return (
		<g className={className}>
			<AreaOnlySeries
				yAccessor={yAccessor}
				interpolation={interpolation}
				base={baseAt}
				canvasGradient={canvasGradient}
				fill={fill}
				opacity={opacity}
				style={style}
				canvasClip={canvasClip}
				stroke="none"
			/>
			<LineSeries
				yAccessor={yAccessor}
				stroke={stroke}
				strokeWidth={strokeWidth}
				strokeOpacity={strokeOpacity}
				strokeDasharray={strokeDasharray}
				interpolation={interpolation}
				style={style}
				canvasClip={canvasClip}
				fill="none"
				hoverHighlight={false}
			/>
		</g>
	);
}

AreaSeries.propTypes = {
	stroke: PropTypes.string,
	strokeWidth: PropTypes.number,
	canvasGradient: PropTypes.func,
	fill: PropTypes.string.isRequired,
	strokeOpacity: PropTypes.number.isRequired,
	opacity: PropTypes.number.isRequired,
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	baseAt: PropTypes.func,
	interpolation: PropTypes.func,
	canvasClip: PropTypes.func,
	style: PropTypes.object,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
};

AreaSeries.defaultProps = {
	stroke: "#4682B4",
	strokeWidth: 1,
	strokeOpacity: 1,
	strokeDasharray: "Solid",
	opacity: 0.5,
	fill: "#4682B4",
	className: "react-stockcharts-area",
};

export default AreaSeries;
