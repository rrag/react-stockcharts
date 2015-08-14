'use strict';

var React = require('react');
var d3 = require('d3');

var ReStock = require('src/');

var { ChartCanvas, DataTransform, Chart, DataSeries } = ReStock;
var { CandlestickSeries } = ReStock;

var { XAxis, YAxis } = ReStock.axes;
var { ChartWidthMixin } = ReStock.helper;

var CandleStickStockScaleChart = React.createClass({
	mixins: [ChartWidthMixin],
	propTypes: {
		data: React.PropTypes.array.isRequired,
		type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	},
	render() {
		if (this.state === null || !this.state.width) return <div />;
		var { type } = this.props;

		var data = this.props.data.slice(0, 150);
		return (
			<ChartCanvas width={this.state.width} height={400}
				margin={{left: 50, right: 50, top:10, bottom: 30}} data={data} type={type}>
				<DataTransform transformType="stockscale">
					<Chart id={1} >
						<XAxis axisAt="bottom" orient="bottom" />
						<YAxis axisAt="right" orient="right" ticks={5} />
						<DataSeries yAccessor={CandlestickSeries.yAccessor} >
							<CandlestickSeries />
						</DataSeries>
					</Chart>
				</DataTransform>
			</ChartCanvas>
		);
	}
});

module.exports = CandleStickStockScaleChart;

