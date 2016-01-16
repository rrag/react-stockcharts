"use strict";

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithForceIndexIndicator from "lib/charts/CandleStickChartWithForceIndexIndicator";

var { TypeChooser } = helper;

var ForceIndexIndicatorPage = React.createClass({
	statics: {
		title: "Indicators - ForceIndex"
	},
	render() {
		return (
			<ContentSection title={ForceIndexIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/MACD-INDICATOR")}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<CandleStickChartWithForceIndexIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default ForceIndexIndicatorPage;
