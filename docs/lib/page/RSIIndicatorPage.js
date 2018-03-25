

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithRSIIndicator from "lib/charts/CandleStickChartWithRSIIndicator";

class RSIIndicatorPage extends React.Component {

	render() {
		return (
			<ContentSection title={RSIIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithRSIIndicator data={this.props.someData} type={type} />}
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

RSIIndicatorPage.title = "RSI and ATR";

export default RSIIndicatorPage;
