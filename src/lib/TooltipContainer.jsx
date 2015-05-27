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
		return (
			<g className="toottip-hover">
				{this.props.children}
			</g>
		);
	}
});

module.exports = TooltipContainer;
