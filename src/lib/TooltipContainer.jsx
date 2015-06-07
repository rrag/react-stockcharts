'use strict';
var React = require('react');
var Utils = require('./utils/utils');
var PureComponent = require('lib/utils/PureComponent');

class TooltipContainer extends PureComponent {
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
			<g className="toottip-hover">
				{children}
			</g>
		);
	}
};

TooltipContainer.contextTypes = {
	chartData: React.PropTypes.array.isRequired,
	currentItems: React.PropTypes.array.isRequired,
}

TooltipContainer.defaultProps = { namespace: "ReStock.TooltipContainer" };

module.exports = TooltipContainer;
