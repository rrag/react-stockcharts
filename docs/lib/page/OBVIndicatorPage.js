

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithOBVIndicator from "lib/charts/CandleStickChartWithOBVIndicator";

class OBVIndicatorPage extends React.Component {

	render() {
		return (
			<ContentSection title={OBVIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithOBVIndicator data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/RSI-INDICATOR") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

OBVIndicatorPage.title = "OBV";

export default OBVIndicatorPage;
