"use strict";

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithPriceMarkers from "lib/charts/CandleStickChartWithPriceMarkers";

class PriceMarkerPage extends React.Component {
	render() {
		return (
			<ContentSection title={PriceMarkerPage.title}>
				<Row title="">
					<Section colSpan={2}>
						<CandleStickChartWithPriceMarkers data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/PRICEMARKER") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

PriceMarkerPage.title = "Price Marker Demonstration";

export default PriceMarkerPage;
