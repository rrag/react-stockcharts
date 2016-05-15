"use strict";

import React, { PropTypes, Component } from "react";

import wrap from "./wrap";

class VolumeProfileSeries extends Component {
	render() {
		var { className, xScale, yScale, xAccessor, yAccessor, plotData, stroke, type } = this.props;
		var { rows, maxProfileWidthPercent, source, volume, absoluteChange } = this.props;

		// absoluteChange(d)

		return <g></g>;
	}
}
/*			<Line
				className={className}
				xScale={xScale} yScale={yScale}
				xAccessor={xAccessor} yAccessor={yAccessor}
				plotData={plotData}
				stroke={stroke} fill="none"
				type={type} />
*/
VolumeProfileSeries.propTypes = {
	className: PropTypes.string,
};

VolumeProfileSeries.defaultProps = {
	stroke: "#4682B4",
	className: "line ",
	rows: 24,
	maxProfileWidthPercent: 30,
	source: d => d.close,
	volume: d => d.volume,
	absoluteChange: d => d.absoluteChange,
};

VolumeProfileSeries.yAccessor = (d) => d.close;

export default wrap(VolumeProfileSeries);
