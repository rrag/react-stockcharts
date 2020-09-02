

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithCCIIndicator from "lib/charts/CandleStickChartWithCCIIndicator";

class CCIIndicatorPage extends React.Component {

	render() {
		return (
			<ContentSection title={CCIIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithCCIIndicator data={this.props.someData} type={type} />}
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

CCIIndicatorPage.title = "CCI and ATR";

export default CCIIndicatorPage;
