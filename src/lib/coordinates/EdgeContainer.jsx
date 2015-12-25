"use strict";

import React from "react";
import { isReactVersion13 } from "../utils/utils";
import objectAssign from "object-assign";

import PureComponent from "../utils/PureComponent";

class EdgeContainer extends PureComponent {
	render() {
		var children = React.Children.map(this.props.children, (child) => {
			var newChild = isReactVersion13()
				? React.withContext(this.context, () => {
					return React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref }, child.props));
				})
				: child;
				// React.createElement(child.type, objectAssign({ key: child.key, ref: child.ref}, child.props));
			return newChild;
		});
		return <g>{children}</g>;
	}
}

EdgeContainer.contextTypes = {
	width: React.PropTypes.number.isRequired,
	chartData: React.PropTypes.array.isRequired,
	// currentItems: React.PropTypes.array.isRequired,
	axesCanvasContext: React.PropTypes.object,
	type: React.PropTypes.string,
	margin: React.PropTypes.object.isRequired,
	// secretToSuperFastCanvasDraw: React.PropTypes.array.isRequired,
};

export default EdgeContainer;

