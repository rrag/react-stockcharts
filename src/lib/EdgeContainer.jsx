'use strict';
var React = require('react');

var EdgeContainer = React.createClass({
	contextTypes: {
		_chartData: React.PropTypes.array.isRequired
	},
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext._chartData !== this.context._chartData;
	},
	render() {
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));

		return <g>{children}</g>
	}
});

module.exports = EdgeContainer;

