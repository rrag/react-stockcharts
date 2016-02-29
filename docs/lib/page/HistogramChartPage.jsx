'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var { helper: { TypeChooser } } = ReStock;

import HistogramChart from "lib/charts/HistogramChart";

var HistogramChartPage = React.createClass({
	statics: {
		title: "Bar Chart"
	},
	render() {
		return (
			<ContentSection title={HistogramChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<HistogramChart data={this.props.histogramData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/BAR-CHART')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default HistogramChartPage;
