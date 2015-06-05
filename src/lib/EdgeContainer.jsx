'use strict';
var React = require('react');

class EdgeContainer extends React.Component {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext.chartData !== this.context.chartData;
	}
	render() {
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
		return <g>{children}</g>
	}
};

EdgeContainer.contextTypes = {
	chartData: React.PropTypes.array.isRequired
};

module.exports = EdgeContainer;

