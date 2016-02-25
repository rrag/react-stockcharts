"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithFullStochasticsIndicator from "lib/charts/CandleStickChartWithFullStochasticsIndicator";

var { helper: { TypeChooser, SaveChartAsImage } } = ReStock;

var StochasticIndicatorPage = React.createClass({
	statics: {
		title: "Stochastic Oscillator"
	},
	saveChartAsImage(e) {
		var container = React.findDOMNode(this.refs.container);
		SaveChartAsImage.saveChartAsImage(container);
	},
	render() {
		return (
			<ContentSection title={StochasticIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<button type="button" className="btn btn-success btn-lg pull-right" onClick={this.saveChartAsImage} >
							<span className="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>
						</button>
						<TypeChooser ref="container">
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

export default StochasticIndicatorPage;
