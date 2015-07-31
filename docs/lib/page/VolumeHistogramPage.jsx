'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var CandleStickStockScaleChartWithVolumeHistogramV1 = require('lib/charts/CandleStickStockScaleChartWithVolumeHistogramV1');
var CandleStickStockScaleChartWithVolumeHistogramV2 = require('lib/charts/CandleStickStockScaleChartWithVolumeHistogramV2');
var CandleStickStockScaleChartWithVolumeHistogramV3 = require('lib/charts/CandleStickStockScaleChartWithVolumeHistogramV3');

var VolumeHistogramPage = React.createClass({
	statics: {
		title: 'Volume histogram'
	},
	render() {
		return (
			<ContentSection title={VolumeHistogramPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM-INTRO')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChartWithVolumeHistogramV1 data={this.props.someData} />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChartWithVolumeHistogramV2 data={this.props.someData} />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM-Contd')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChartWithVolumeHistogramV3 data={this.props.someData} />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM-Contd2')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = VolumeHistogramPage;
