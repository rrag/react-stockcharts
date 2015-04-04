'use strict';

var React = require('react');
var Utils = require('./utils/utils')

var billion = 1 * 1000 * 1000 * 1000;
var million = 1 * 1000 * 1000;
var thousand = 1 * 1000;

var OHLCTooltip = React.createClass({displayName: "OHLCTooltip",
	propTypes: {
		_currentItem: React.PropTypes.object.isRequired,
		accessor: React.PropTypes.func.isRequired,
		xDisplayFormat: React.PropTypes.func.isRequired,
		origin: React.PropTypes.array.isRequired,
	},
	shouldComponentUpdate:function(nextProps, nextState) {
		return (nextProps._currentItem !== this.props._currentItem);
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.OHLCTooltip",
			accessor: function(d)  {return {date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume}},
			xDisplayFormat: Utils.displayDateFormat,
			origin: [0, 0]
		}
	},
	render:function() {
		var displayDate, fromDate, toDate, open, high, low, close, volume;

		displayDate = fromDate = toDate = open = high = low = close = volume = "n/a";
		var item = this.props.accessor(this.props._currentItem);

		if (item !== undefined && item.close !== undefined) {
			volume = (item.volume / billion > 1)
				? (item.volume / billion).toFixed(2) + "b"
				: (item.volume / million > 1)
					? (item.volume / million).toFixed(2) + "m"
					: (item.volume / thousand > 1)
						? (item.volume / thousand).toFixed(2) + "k"
						: item.volume;

			displayDate = this.props.xDisplayFormat(item.date);
			open = Utils.displayNumberFormat(item.open);
			high = Utils.displayNumberFormat(item.high);
			low = Utils.displayNumberFormat(item.low);
			close = Utils.displayNumberFormat(item.close);
		}

		return (
			React.createElement("g", {transform: "translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")"}, 
				React.createElement("text", {x: 0, y: 0, className: "legend"}, 
					React.createElement("tspan", {key: "label", x: 0, dy: "5", className: "tooltip-label"}, "Date: "), 
					React.createElement("tspan", {key: "value"}, displayDate), 
					React.createElement("tspan", {key: "label_O", className: "tooltip-label"}, " O: "), React.createElement("tspan", {key: "value_O"}, open), 
					React.createElement("tspan", {key: "label_H", className: "tooltip-label"}, " H: "), React.createElement("tspan", {key: "value_H"}, high), 
					React.createElement("tspan", {key: "label_L", className: "tooltip-label"}, " L: "), React.createElement("tspan", {key: "value_L"}, low), 
					React.createElement("tspan", {key: "label_C", className: "tooltip-label"}, " C: "), React.createElement("tspan", {key: "value_C"}, close), 
					React.createElement("tspan", {key: "label_Vol", className: "tooltip-label"}, " Vol: "), React.createElement("tspan", {key: "value_Vol"}, volume)
				)
			)
		);
	}
});

module.exports = OHLCTooltip;
