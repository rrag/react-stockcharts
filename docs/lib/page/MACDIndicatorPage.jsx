"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithMACDIndicator = require("lib/charts/CandleStickChartWithMACDIndicator");

var MousePointerPage = React.createClass({
	statics: {
		title: "Indicators - MACD"
	},
	render() {
		return (
			<ContentSection title={MousePointerPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/MACD-INDICATOR")}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <CandleStickChartWithMACDIndicator data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = MousePointerPage;
