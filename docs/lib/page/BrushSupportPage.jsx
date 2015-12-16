"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var SaveChartAsImage = require("src/").helper.SaveChartAsImage;
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithBrush = require("lib/charts/CandleStickChartWithBrush");

var BrushSupportPage = React.createClass({
	statics: {
		title: "Brush"
	},
	render() {
		return (
			<ContentSection title={BrushSupportPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/BRUSH-INTERACTIVE-INDICATOR')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithBrush data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = BrushSupportPage;
