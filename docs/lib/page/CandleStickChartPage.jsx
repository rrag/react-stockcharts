'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChart from "lib/charts/CandleStickChart";
import CandleStickStockScaleChart from "lib/charts/CandleStickStockScaleChart";

var CandleStickChartPage = React.createClass({
	statics: {
		title: 'Candlestick Chart'
	},
	render() {
		return (
			<ContentSection title={CandleStickChartPage.title}>
				<Row title="">
					<Section colSpan={2}>
						<CandleStickChart data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CANDLESTICK')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<CandleStickStockScaleChart data={this.props.someData} type="svg" />
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

export default CandleStickChartPage;
