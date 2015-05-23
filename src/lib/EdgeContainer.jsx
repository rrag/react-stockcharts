'use strict';
var React = require('react');

var EdgeContainer = React.createClass({
	contextTypes: {
		_width: React.PropTypes.number.isRequired,
		_height: React.PropTypes.number.isRequired,
		_currentItems: React.PropTypes.array.isRequired,
		_chartData: React.PropTypes.array.isRequired,
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.EdgeContainer",
		}
	},
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			if (/EdgeIndicator$/.test(newChild.props.namespace)) {
				var chart = this.context._chartData.filter((chart) => chart.id === newChild.props.forChart)[0];
				var currentItem = this.context._currentItems.filter((item) => item.id === newChild.props.forChart)[0];
				newChild = React.cloneElement(newChild, {
					_width: this.context._width,
					_chart: chart,
					_currentItem: currentItem
				});
			}
			return newChild;
		});
	},
	render() {
		return <g>{this.renderChildren()}</g>
	}
});

module.exports = EdgeContainer;

