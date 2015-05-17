'use strict';
var React = require('react');

var TooltipContainer = React.createClass({
	propTypes: {
		_currentItems: React.PropTypes.array.isRequired,
		_charts: React.PropTypes.array.isRequired
	},
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps._charts !== this.props._charts || nextProps._currentItems !== this.props._currentItems;
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.TooltipContainer"
		}
	},
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			var chart = this.props._charts.filter((chart) => chart.id === newChild.props.forChart)[0];
			var currentItem = this.props._currentItems.filter((item) => item.id === newChild.props.forChart)[0];
			newChild = React.addons.cloneWithProps(newChild, {
				_currentItem: currentItem.data
			});
			if (/MovingAverageTooltip$/.test(newChild.props.namespace)) {
				newChild = React.addons.cloneWithProps(newChild, {
					_overlays: chart.overlays
				});
			}
			return newChild;
		});
	},
	render() {
		return (
			<g className="toottip-hover">
				{this.renderChildren()}
			</g>
		);
	}
});

module.exports = TooltipContainer;
