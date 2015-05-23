"use strict";

var React = require('react');

var ForChartMixin = {
	contextTypes: {
		_chartData: React.PropTypes.array.isRequired,
		_currentItems: React.PropTypes.array.isRequired,
	},
	getChartData() {
		var chartData = this.context._chartData.filter((each) => each.id === this.props.forChart)[0];
		return chartData;
	},
	getCurrentItem() {
		var currentItem = this.context._currentItems.filter((each) => each.id === this.props.forChart)[0];
		var item = currentItem ? currentItem.data : {}
		return item;
	}
};

module.exports = ForChartMixin;
