'use strict';
var React = require('react/addons');

var EdgeContainer = React.createClass({displayName: "EdgeContainer",
	propTypes: {
		_currentItems: React.PropTypes.array.isRequired,
		_charts: React.PropTypes.array.isRequired,
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.EdgeContainer",
		}
	},
	renderChildren:function() {
		return React.Children.map(this.props.children, function(child)  {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			if (/EdgeIndicator$/.test(newChild.props.namespace)) {
				var chart = this.props._charts.filter(function(chart)  {return chart.id === newChild.props.forChart;})[0];
				var currentItem = this.props._currentItems.filter(function(item)  {return item.id === newChild.props.forChart;})[0];
				newChild = React.addons.cloneWithProps(newChild, {
					_width: this.props._width,
					_chart: chart,
					_currentItem: currentItem
				});
			}
			return newChild;
		}.bind(this));
	},
	render:function() {
		return React.createElement("g", null, this.renderChildren())
	}
});

module.exports = EdgeContainer;

