"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var SaveChartAsImage = require("src/").helper.SaveChartAsImage;
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithFibonacciInteractiveIndicator = require("lib/charts/CandleStickChartWithFibonacciInteractiveIndicator");

var FibonacciInteractiveIndicatorPage = React.createClass({
	statics: {
		title: "Interactive Indicators - Fibonacci Retracement"
	},
	render() {
		return (
			<ContentSection title={FibonacciInteractiveIndicatorPage.title}>
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

module.exports = FibonacciInteractiveIndicatorPage;
