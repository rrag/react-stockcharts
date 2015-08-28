"use strict";

import React from "react";
import Utils from "./utils/utils";
import objectAssign from "object-assign";

class OverlaySeries extends React.Component {

	getChildContext() {
		var overlay = this.context.overlays.filter((each) => each.id === this.props.id)[0];
		return {
			yAccessor: overlay.yAccessor,
			stroke: overlay.stroke
		};
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = Utils.isReactVersion13()
				? React.withContext(this.getChildContext(), () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
				})
				: React.cloneElement(child);
				// React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
			return newChild;
		});
		return (
			<g>{children}</g>
		);
	}
}

OverlaySeries.propTypes = {
	// type: React.PropTypes.oneOf(["sma", "ema"]),
	id: React.PropTypes.number.isRequired,
	// stroke: React.PropTypes.string
	// xAccessor: React.PropTypes.func,
	// yAccessor: React.PropTypes.func,
	indicator: React.PropTypes.func.isRequired,
	options: React.PropTypes.object.isRequired,
};
OverlaySeries.defaultProps = {
	namespace: "ReStock.OverlaySeries"
};
OverlaySeries.contextTypes = {
	overlays: React.PropTypes.array.isRequired,
};
OverlaySeries.childContextTypes = {
	yAccessor: React.PropTypes.func.isRequired,
	stroke: React.PropTypes.any.isRequired,
};
module.exports = OverlaySeries;
