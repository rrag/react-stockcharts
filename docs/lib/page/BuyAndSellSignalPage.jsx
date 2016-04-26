"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import OHLCChartWithElderImpulseIndicator from "lib/charts/OHLCChartWithElderImpulseIndicator";

var { helper: { TypeChooser } } = ReStock;

var ElderImpulseIndicatorPage = React.createClass({
	statics: {
		title: "Buy and Sell signals"
	},
	render() {
		return (
			<ContentSection title={ElderImpulseIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<OHLCChartWithElderImpulseIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/ELDER-IMPULSE-INDICATOR")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default ElderImpulseIndicatorPage;
