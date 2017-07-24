"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";
import CandleStickChartWithBollingerBandOverlay from "lib/charts/CandleStickChartWithBollingerBandOverlay";

class BollingerBandOverlayPage extends React.Component {
	render() {
		return (
			<ContentSection title={BollingerBandOverlayPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithBollingerBandOverlay data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/BOLLINGER-BAND-OVERLAY") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

BollingerBandOverlayPage.title = "Bollinger Band";

export default BollingerBandOverlayPage;
