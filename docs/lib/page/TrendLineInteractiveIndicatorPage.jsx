"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var SaveChartAsImage = require("src/").helper.SaveChartAsImage;
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithInteractiveIndicator = require("lib/charts/CandleStickChartWithInteractiveIndicator");

var TrendLineInteractiveIndicatorPage = React.createClass({
	statics: {
		title: "Interactive Indicators - Trendline"
	},
	saveChartAsImage(e) {
		var container = React.findDOMNode(this.refs.container);
		SaveChartAsImage.saveChartAsImage(container);
	},
	render() {
		return (
			<ContentSection title={TrendLineInteractiveIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<button type="button" className="btn btn-success btn-lg pull-right" onClick={this.saveChartAsImage} >
							<span className="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>
						</button>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithInteractiveIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = TrendLineInteractiveIndicatorPage;
