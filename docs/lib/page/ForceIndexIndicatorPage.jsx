"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithForceIndexIndicator from "lib/charts/CandleStickChartWithForceIndexIndicator";

class ForceIndexIndicatorPage extends React.Component {
	render() {
		return (
			<ContentSection title={ForceIndexIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/FORCE-INDEX-INDICATOR") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithForceIndexIndicator data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

ForceIndexIndicatorPage.title = "ForceIndex";

export default ForceIndexIndicatorPage;
