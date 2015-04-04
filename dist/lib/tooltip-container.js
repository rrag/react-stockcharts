'use strict';
var React = require('react');

var TooltipContainer = React.createClass({displayName: "TooltipContainer",
	propTypes: {
		_currentItems: React.PropTypes.array.isRequired,
		_charts: React.PropTypes.array.isRequired
	},
	shouldComponentUpdate:function(nextProps, nextState) {
		return nextProps._charts !== this.props._charts || nextProps._currentItems !== this.props._currentItems;
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.TooltipContainer"
		}
	},
	renderChildren:function() {
		return React.Children.map(this.props.children, function(child)  {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			var chart = this.props._charts.filter(function(chart)  {return chart.id === newChild.props.forChart;})[0];
			var currentItem = this.props._currentItems.filter(function(item)  {return item.id === newChild.props.forChart;})[0];
			newChild = React.addons.cloneWithProps(newChild, {
				_currentItem: currentItem.data
			});
			if (/MovingAverageTooltip$/.test(newChild.props.namespace)) {
				newChild = React.addons.cloneWithProps(newChild, {
					_overlays: chart.overlays
				});
			}
			return newChild;
		}.bind(this));
	},
	render:function() {
		return (
			React.createElement("g", {className: "toottip-hover"}, 
				this.renderChildren()
			)
		);
	}
});

module.exports = TooltipContainer;
