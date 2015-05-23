'use strict';

var React = require('react');
var Utils = require('./utils/utils')

var billion = 1 * 1000 * 1000 * 1000;
var million = 1 * 1000 * 1000;
var thousand = 1 * 1000;

var OHLCTooltip = React.createClass({
	propTypes: {
		// _currentItem: React.PropTypes.object.isRequired,
		forChart: React.PropTypes.number.isRequired,
		accessor: React.PropTypes.func.isRequired,
		xDisplayFormat: React.PropTypes.func.isRequired,
		origin: React.PropTypes.array.isRequired,
	},
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return (nextContext._currentItems !== this.context._currentItems);
	},
	contextTypes: {
		_chartData: React.PropTypes.array.isRequired,
		_currentItems: React.PropTypes.array.isRequired,
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.OHLCTooltip",
			accessor: (d) => {return {date: d.date, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume}},
			xDisplayFormat: Utils.displayDateFormat,
			origin: [0, 0]
		}
	},
	render() {
		console.log(this.context._chartData, this.context._currentItems);
		var displayDate, fromDate, toDate, open, high, low, close, volume;

		displayDate = fromDate = toDate = open = high = low = close = volume = "n/a";
		var currentItem = this.context._currentItems.filter((each) => each.id === this.props.forChart)[0];
		var item = this.props.accessor(currentItem || {});

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
			<g transform={"translate(" + this.props.origin[0] + ", " + this.props.origin[1] + ")"}>
				<text x={0} y={0} className="legend">
					<tspan key="label" x={0} dy="5" className="tooltip-label">Date: </tspan>
					<tspan key="value">{displayDate}</tspan>
					<tspan key="label_O" className="tooltip-label"> O: </tspan><tspan key="value_O">{open}</tspan>
					<tspan key="label_H" className="tooltip-label"> H: </tspan><tspan key="value_H">{high}</tspan>
					<tspan key="label_L" className="tooltip-label"> L: </tspan><tspan key="value_L">{low}</tspan>
					<tspan key="label_C" className="tooltip-label"> C: </tspan><tspan key="value_C">{close}</tspan>
					<tspan key="label_Vol" className="tooltip-label"> Vol: </tspan><tspan key="value_Vol">{volume}</tspan>
				</text>
			</g>
		);
	}
});

module.exports = OHLCTooltip;
