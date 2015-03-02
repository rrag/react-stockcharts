'use strict';

var React = require('react');
var Utils = require('./utils/utils')

var billion = 1 * 1000 * 1000 * 1000;
var million = 1 * 1000 * 1000;
var thousand = 1 * 1000;

var OHLCTooltip = React.createClass({
	propTypes: {
		_currentItem: React.PropTypes.object.isRequired,
		accessor: React.PropTypes.func.isRequired,
		xDisplayFormat: React.PropTypes.func.isRequired
	},
	shouldComponentUpdate(nextProps, nextState) {
		return (nextProps._currentItem !== this.props._currentItem);
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.OHLCTooltip",
			accessor: (d) => {return {date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume}},
			xDisplayFormat: Utils.displayDateFormat
		}
	},
	render() {
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
			<text x={0} y={0} className="legend">
				<tspan key="label" x={0} dy="5" className="tooltip-label">Date: </tspan>
				<tspan key="value">{displayDate}</tspan>
				<tspan key="label_O" className="tooltip-label"> O: </tspan><tspan key="value_O">{open}</tspan>
				<tspan key="label_H" className="tooltip-label"> H: </tspan><tspan key="value_H">{high}</tspan>
				<tspan key="label_L" className="tooltip-label"> L: </tspan><tspan key="value_L">{low}</tspan>
				<tspan key="label_C" className="tooltip-label"> C: </tspan><tspan key="value_C">{close}</tspan>
				<tspan key="label_Vol" className="tooltip-label"> Vol: </tspan><tspan key="value_Vol">{volume}</tspan>
			</text>
		);
	}
});

module.exports = OHLCTooltip;
