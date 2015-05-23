'use strict';
var React = require('react');

var TooltipContainer = React.createClass({
	/*propTypes: {
		_currentItems: React.PropTypes.array.isRequired,
		_charts: React.PropTypes.array.isRequired
	},*/
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return nextContext._chartData !== this.context._chartData || nextContext._currentItems !== this.context._currentItems;
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.TooltipContainer"
		}
	},
	/*
	childContextTypes: {
		//_currentItem: React.PropTypes.object,
		_overlays: React.PropTypes.array,
	},
	getChildContext() {
		var currentItem = this.context._currentItems.filter((item) => item.id === newChild.props.forChart)[0];

		console.log('adskljfdslfjadslfhdsjfhsdkl = ', currentItems);
		return {
			//_currentItem: React.PropTypes.object,
			_overlays: React.PropTypes.array,
		};
	},*/
	renderChildren() {
		return React.Children.map(this.props.children, (child) => {
			if (typeof child.type === 'string') return child;
			var newChild = child;/*
			var chart = this.context._chartData.filter((chart) => chart.id === newChild.props.forChart)[0];
			newChild = React.cloneElement(newChild, {
				_currentItem: currentItem !== undefined ? currentItem.data : {}
			});
			if (/MovingAverageTooltip$/.test(newChild.props.namespace)) {
				newChild = React.cloneElement(newChild, {
					_overlays: chart.overlays
				});
			}*/
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
