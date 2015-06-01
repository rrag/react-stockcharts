'use strict';
var React = require('react'),
	d3 = require('d3');

var KagiSeries = React.createClass({
	contextTypes: {
		xScale: React.PropTypes.func.isRequired,
		yScale: React.PropTypes.func.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		yAccessor: React.PropTypes.func.isRequired,
		_data: React.PropTypes.array.isRequired,
	},
	statics: {
		yAccessor: (d) => ({open: d.open, high: d.high, low: d.low, close: d.close})
	},
	getDefaultProps() {
		return {
			namespace: "ReStock.KagiSeries"
		}
	},
	render() {
		var kagiLine = new Array();
		var kagi = {};
		for (var i = 0; i < this.context._data.length; i++) {
			var d = this.context._data[i];
			if (d.close === undefined) continue;
			if (kagi.type === undefined) kagi.type = d.startAs;
			if (kagi.plot === undefined) kagi.plot = new Array();
			var idx = this.context.xAccessor(d);
			kagi.plot.push([idx, d.open]);

			if (d.changePoint != undefined) {
				kagi.plot.push([idx, d.changePoint]);
				kagiLine.push(kagi);
				kagi = {
					type: d.changeTo
					, plot: []
				};
				kagi.plot.push([idx, d.changePoint]);
			}
		};

		var props = this.props;

		var paths = kagiLine.map((each, i) => {

			var dataSeries = d3.svg.line()
				.x((d) => this.context.xScale(d[0]))
				.y((d) => this.context.yScale(d[1]))
				.interpolate("step-before");
			return (<path key={i} d={dataSeries(each.plot)} className={each.type} />)
		});
		return (
			<g>
				{paths}
			</g>
		);
	}
});

module.exports = KagiSeries;
