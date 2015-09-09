"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithFullStochasticsIndicator = require("lib/charts/CandleStickChartWithFullStochasticsIndicator");

var StochasticIndicatorPage = React.createClass({
	statics: {
		title: "Indicators - Stochastic Oscillator"
	},
	render() {
		return (
			<ContentSection title={StochasticIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<CandleStickChartWithFullStochasticsIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/STOCHASTIC-INDICATOR")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = StochasticIndicatorPage;
