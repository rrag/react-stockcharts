"use strict";

import React from "react";
import { isReactVersion13 } from "../utils/utils";
import PureComponent from "../utils/PureComponent";
import objectAssign from "object-assign";

class TooltipContainer extends PureComponent {
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
		return (
			<g className="react-stockcharts-toottip-hover">
				{children}
			</g>
		);
	}
}

TooltipContainer.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
};

TooltipContainer.defaultProps = { namespace: "ReStock.TooltipContainer" };

export default TooltipContainer;
