'use strict';

var Utils = require('./utils');
var MACalculator = require('./moving-average-calculator');

var OverlayUtils = {
	getToolTipLabel:function(props) {
		if (props.type === "sma" || props.type === "ema") {
			var tooltip = props.type.toUpperCase() + '(' + props.options.period + ')';
			return tooltip;
		}
		return 'N/A';
	},/*
	getYAccessor(chartId, props) {
		if (props.type === "sma" || props.type === "ema") {
			var key = props.type + props.options.period + '_chart_' + chartId;
			return (d) => d[key];
		}
		return false;
	},*/
	getYAccessorKey:function(chartId, props) {
		if (props.type === "sma" || props.type === "ema") {
			var key = props.type + props.options.period + '_chart_' + chartId;
			return key;
		}
		return false;
	},
	calculateOverlay:function(data, overlay) {
		console.log(overlay);
		if (overlay.type === 'sma') {
			data = MACalculator.calculateSMA(data, overlay.options.period, overlay.key, overlay.options.pluck);
		} else if (overlay.type === 'ema') {
			data = MACalculator.calculateEMA(data, overlay.options.period, overlay.key, overlay.options.pluck);
		}
		return data;
	},
	firstDefined:function(data, accessor) {
		var each;
		for (var i = 0; i < data.length; i++) {
			if (accessor(data[i]) === undefined) continue;
			each = data[i];
			// console.log(i, each, accessor(each));
			break;
		};
		return Utils.cloneMe(each);
	},
	lastDefined:function(data, accessor) {
		var each;
		for (var i = data.length - 1; i >= 0; i--) {
			if (accessor(data[i]) === undefined) continue;
			each = data[i];
			// console.log(i, each, accessor(each));
			break;
		};
		return Utils.cloneMe(each);
	}
}

module.exports = OverlayUtils;
