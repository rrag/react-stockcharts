

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithADXIndicator from "lib/charts/CandleStickChartWithADXIndicator";

class ADXIndicatorPage extends React.Component {

	render() {
		return (
			<ContentSection title={ADXIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithADXIndicator data={this.props.someData} type={type} />}
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

ADXIndicatorPage.title = "ADX";

export default ADXIndicatorPage;
