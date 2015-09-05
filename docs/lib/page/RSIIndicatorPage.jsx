"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithRSIIndicator = require("lib/charts/CandleStickChartWithRSIIndicator");

var RSIIndicatorPage = React.createClass({
	statics: {
		title: "Indicators - RSI"
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

module.exports = RSIIndicatorPage;
