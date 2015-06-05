'use strict';
var React = require('react');

class TooltipContainer extends React.Component {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext.chartData !== this.context.chartData || nextContext.currentItems !== this.context.currentItems;
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
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
