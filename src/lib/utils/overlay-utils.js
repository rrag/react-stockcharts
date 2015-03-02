'use strict';

var Utils = require('./utils');

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
	}
}

module.exports = OverlayUtils;
