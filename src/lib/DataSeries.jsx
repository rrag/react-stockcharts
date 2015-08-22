"use strict";

import React from "react";
import Utils from "./utils/utils";

class DataSeries extends React.Component {
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.context, () => {
					return React.createElement(child.type, Utils.mergeObject({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
			return newChild;
		});
		return (
			<g style={{ "clipPath": "url(#chart-area-clip)" }}>{children}</g>
		);
	}
}

DataSeries.propTypes = {
	xAccessor: React.PropTypes.func,
	yAccessor: React.PropTypes.func,
	indicator: React.PropTypes.func,
	options: React.PropTypes.object,
};

DataSeries.defaultProps = {
	namespace: "ReStock.DataSeries",
	compareBase: (d) => d.close,
};

module.exports = DataSeries;
