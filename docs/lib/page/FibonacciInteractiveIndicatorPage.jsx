"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var { helper: { TypeChooser } } = ReStock;

import CandleStickChartWithFibonacciInteractiveIndicator from "lib/charts/CandleStickChartWithFibonacciInteractiveIndicator";

var FibonacciInteractiveIndicatorPage = React.createClass({
	statics: {
		title: "Fibonacci Retracement"
	},
	render() {
		return (
			<ContentSection title={FibonacciInteractiveIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/FIBB-RETRACEMENTS-INTERACTIVE-INDICATOR')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithFibonacciInteractiveIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default FibonacciInteractiveIndicatorPage;
