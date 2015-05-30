'use strict';
var React = require('react');

var TooltipContainer = React.createClass({
	contextTypes: {
		_chartData: React.PropTypes.array.isRequired,
		_currentItems: React.PropTypes.array.isRequired,
	},
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext._chartData !== this.context._chartData || nextContext._currentItems !== this.context._currentItems;
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.TooltipContainer"
		}
	},/*
	componentDidMount() {
		console.log('here', this.props.c());
	},*/
	render() {
		var children = React.Children.map(this.props.children, (child) => React.cloneElement(child));
		return (
			<g className="toottip-hover">
				{children}
			</g>
		);
	}
});

module.exports = TooltipContainer;
