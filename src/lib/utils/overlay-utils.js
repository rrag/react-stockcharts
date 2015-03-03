'use strict';

var Utils = require('./utils');
var MACalculator = require('./moving-average-calculator');

var OverlayUtils = {
	getToolTipLabel(props) {
		if (props.type === "sma" || props.type === "ema") {
			var tooltip = props.type.toUpperCase() + '(' + props.options.period + ')';
			return tooltip;
		}
		return 'N/A';
	},
	getYAccessor(props) {
		if (props.type === "sma" || props.type === "ema") {
			var key = props.type + props.options.period;
			return (d) => d[key];
		}
		return false;
	},
	calculateOverlay(data, overlay) {
		console.log(overlay);
		if (overlay.type === 'sma') {
			MACalculator.calculateSMA(data, overlay.options.period);
		} else if (overlay.type === 'ema') {
			MACalculator.calculateEMA(data, overlay.options.period);
		}
	}
}

module.exports = OverlayUtils;
