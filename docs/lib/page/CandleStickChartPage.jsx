'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CandleStickChart = require('lib/examples/CandleStickChart');
var CandleStickStockScaleChart = require('lib/examples/CandleStickStockScaleChart');

var CandleStickChartPage = React.createClass({
	statics: {
		title: 'Candlestick Chart'
	},
	render() {
		return (
			<ContentSection title={CandleStickChartPage.title}>
				<Row title="">
					<Section colSpan={2} className="react-stockchart">
						<CandleStickChart data={this.props.someData} />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CANDLESTICK')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2} className="react-stockchart">
						<CandleStickStockScaleChart data={this.props.someData} />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CANDLESTICK-IMPROVED')}}></aside>
					</Section>
				</Row>
				<Row title="stocktime scale">
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/FINANCETIMESCALE')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = CandleStickChartPage;
