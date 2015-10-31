"use strict";

import React from "react";
import Utils from "./utils/utils";
import objectAssign from "object-assign";

class DataSeries extends React.Component {

	getChildContext() {
		var overlay = this.context.overlays.filter((each) => each.id === this.props.id)[0];

		return {
			seriesId: this.props.id,
			yAccessor: overlay.yAccessor,
			indicator: overlay.indicator,
			stroke: overlay.stroke,
			fill: overlay.fill,
		};
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: child;
				// React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
			return newChild;
		});
		return (
			<g style={{ "clipPath": "url(#chart-area-clip)" }}>{children}</g>
		);
	}
}

DataSeries.propTypes = {
	// type: React.PropTypes.oneOf(["sma", "ema"]),
	id: React.PropTypes.number.isRequired,
	// stroke: React.PropTypes.string
	// xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	indicator: React.PropTypes.func,
	options: React.PropTypes.object,
};
DataSeries.defaultProps = {
	namespace: "ReStock.DataSeries",
	compareBase: (d) => d.close,
};
DataSeries.contextTypes = {
	overlays: React.PropTypes.array.isRequired,
};
DataSeries.childContextTypes = {
	yAccessor: React.PropTypes.func.isRequired,
	indicator: React.PropTypes.func,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
	seriesId: React.PropTypes.number.isRequired,
};
module.exports = DataSeries;
