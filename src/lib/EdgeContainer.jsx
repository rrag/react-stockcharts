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
		return <g>{this.props.children}</g>
	}
});

module.exports = EdgeContainer;

