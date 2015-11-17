"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var SaveChartAsImage = require("src/").helper.SaveChartAsImage;
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithDarkTheme = require("lib/charts/CandleStickChartWithDarkTheme");

var DarkThemePage = React.createClass({
	statics: {
		title: "Theme - Dark"
	},
	saveChartAsImage(e) {
		var container = React.findDOMNode(this.refs.container);
		SaveChartAsImage.saveChartAsImage(container);
	},
	render() {
		return (
			<ContentSection title={DarkThemePage.title}>
				<Row>
					<Section  colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/DARK-THEME')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2} className="dark">
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithDarkTheme data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = DarkThemePage;
