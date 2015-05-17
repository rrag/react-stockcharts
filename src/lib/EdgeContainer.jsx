'use strict';
var React = require('react/addons');

var EdgeContainer = React.createClass({
	propTypes: {
		_currentItems: React.PropTypes.array.isRequired,
		_charts: React.PropTypes.array.isRequired,
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
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
				var chart = this.props._charts.filter((chart) => chart.id === newChild.props.forChart)[0];
				var currentItem = this.props._currentItems.filter((item) => item.id === newChild.props.forChart)[0];
				newChild = React.addons.cloneWithProps(newChild, {
					_width: this.props._width,
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

