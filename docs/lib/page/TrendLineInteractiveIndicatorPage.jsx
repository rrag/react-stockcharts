"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithInteractiveIndicator from "lib/charts/CandleStickChartWithInteractiveIndicator";

var { helper: { TypeChooser, SaveChartAsImage } } = ReStock;

var TrendLineInteractiveIndicatorPage = React.createClass({
	statics: {
		title: "Trendline"
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
						<aside dangerouslySetInnerHTML={{__html: require('md/TRENDLINES-INTERACTIVE-INDICATOR')}}></aside>
					</Section>
				</Row>
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

export default TrendLineInteractiveIndicatorPage;
