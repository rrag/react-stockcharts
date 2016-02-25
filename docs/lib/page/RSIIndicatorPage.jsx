"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithRSIIndicator from "lib/charts/CandleStickChartWithRSIIndicator";

var { helper: { TypeChooser } } = ReStock;

var RSIIndicatorPage = React.createClass({
	statics: {
		title: "RSI"
	},
	render() {
		return (
			<ContentSection title={RSIIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<CandleStickChartWithRSIIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/RSI-INDICATOR")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default RSIIndicatorPage;
