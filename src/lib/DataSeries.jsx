"use strict";

import React from "react";
import objectAssign from "object-assign";

import { isReactVersion13 } from "./utils/utils";

// Cannot make this PureComponent because its children use some things from context
// and making this pure would stop its children from updating on state changes of EventHandler
// refer to https://github.com/facebook/react/issues/2517
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
			var newChild = isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref }, child.props));
				})
				: child;
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
	children: React.PropTypes.node.isRequired,
};
DataSeries.defaultProps = {
	namespace: "ReStock.DataSeries",
	compareBase: (d) => d.close,
};
DataSeries.contextTypes = {
	overlays: React.PropTypes.array.isRequired,
};
DataSeries.childContextTypes = {
	seriesId: React.PropTypes.number.isRequired,
	yAccessor: React.PropTypes.func.isRequired,
	indicator: React.PropTypes.func,
	stroke: React.PropTypes.string,
	fill: React.PropTypes.string,
};

export default DataSeries;
