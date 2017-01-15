"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithFibonacciInteractiveIndicator from "lib/charts/CandleStickChartWithFibonacciInteractiveIndicator";

class FibonacciInteractiveIndicatorPage extends React.Component {
	render() {
		return (
			<ContentSection title={FibonacciInteractiveIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/FIBB-RETRACEMENTS-INTERACTIVE-INDICATOR") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithFibonacciInteractiveIndicator data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

FibonacciInteractiveIndicatorPage.title = "Fibonacci Retracement";

export default FibonacciInteractiveIndicatorPage;
