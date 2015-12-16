"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var SaveChartAsImage = require("src/").helper.SaveChartAsImage;
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithClickHandlerCallback = require("lib/charts/CandleStickChartWithClickHandlerCallback");

var ClickHandlerCallbackPage = React.createClass({
	statics: {
		title: "Click callback"
	},
	render() {
		return (
			<ContentSection title={ClickHandlerCallbackPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CLICK-CALLBACK-INTERACTIVE-INDICATOR')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithClickHandlerCallback data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = ClickHandlerCallbackPage;
