"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import OHLCChartWithElderImpulseIndicator from "lib/charts/OHLCChartWithElderImpulseIndicator";

class ElderImpulseIndicatorPage extends React.Component {
	render() {
		return (
			<ContentSection title={ElderImpulseIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/ELDER-IMPULSE-INDICATOR") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <OHLCChartWithElderImpulseIndicator data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

ElderImpulseIndicatorPage.title = "Elder Impulse";

export default ElderImpulseIndicatorPage;
