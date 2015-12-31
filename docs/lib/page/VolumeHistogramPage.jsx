'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickStockScaleChartWithVolumeHistogramV1 from "lib/charts/CandleStickStockScaleChartWithVolumeHistogramV1";
import CandleStickStockScaleChartWithVolumeHistogramV2 from "lib/charts/CandleStickStockScaleChartWithVolumeHistogramV2";
import CandleStickStockScaleChartWithVolumeHistogramV3 from "lib/charts/CandleStickStockScaleChartWithVolumeHistogramV3";

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
						<CandleStickStockScaleChartWithVolumeHistogramV1 data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChartWithVolumeHistogramV2 data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/VOLUME-HISTOGRAM-Contd')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChartWithVolumeHistogramV3 data={this.props.someData} type="svg" />
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

export default VolumeHistogramPage;
