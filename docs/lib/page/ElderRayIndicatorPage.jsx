"use strict";

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import OHLCChartWithElderRayIndicator from "lib/charts/OHLCChartWithElderRayIndicator";

var { TypeChooser } = helper;

var ElderRayIndicatorPage = React.createClass({
	statics: {
		title: "Indicators - ElderRay"
	},
	render() {
		return (
			<ContentSection title={ElderRayIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/ELDER-RAY-INDICATOR")}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<OHLCChartWithElderRayIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default ElderRayIndicatorPage;
