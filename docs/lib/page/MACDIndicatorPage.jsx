"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithMACDIndicator from "lib/charts/CandleStickChartWithMACDIndicator";

var { helper: { TypeChooser } } = ReStock;

var MACDIndicatorPage = React.createClass({
	statics: {
		title: "MACD"
	},
	render() {
		return (
			<ContentSection title={MACDIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/MACD-INDICATOR")}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<CandleStickChartWithMACDIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default MACDIndicatorPage;
