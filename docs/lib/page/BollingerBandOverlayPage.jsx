'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";
import CandleStickChartWithBollingerBandOverlay from "lib/charts/CandleStickChartWithBollingerBandOverlay";

var { helper: { TypeChooser } } = ReStock;

var BollingerBandOverlayPage = React.createClass({
	statics: {
		title: 'Bollinger Band'
	},
	render() {
		return (
			<ContentSection title={BollingerBandOverlayPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser type="hybrid">
							{(type) => <CandleStickChartWithBollingerBandOverlay data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/BOLLINGER-BAND-OVERLAY')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default BollingerBandOverlayPage;
