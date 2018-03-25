

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";
import { TypeChooser } from "react-stockcharts/lib/helper";

import CandleStickChartWithPriceMarkers from "lib/charts/CandleStickChartWithPriceMarkers";

class PriceMarkerPage extends React.Component {
	render() {
		return (
			<ContentSection title={PriceMarkerPage.title}>
				<Row title="">
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <CandleStickChartWithPriceMarkers data={this.props.someData} type={type} />}
						</TypeChooser>
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
