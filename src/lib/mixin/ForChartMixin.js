"use strict";

var React = require('react');

var ForChartMixin = {
	contextTypes: {
		chartData: React.PropTypes.array.isRequired,
		currentItems: React.PropTypes.array.isRequired,
	},
	getChartData() {
		var chartData = this.context.chartData.filter((each) => each.id === this.props.forChart)[0];
		return chartData;
	},
	getCurrentItem() {
		var currentItem = this.context.currentItems.filter((each) => each.id === this.props.forChart)[0];
		var item = currentItem ? currentItem.data : {}
		return item;
	}
};

module.exports = ForChartMixin;
