'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var { helper: { TypeChooser } } = ReStock;

import HorizontalStackedBarChart from "lib/charts/HorizontalStackedBarChart";

var HorizontalBarChartPage = React.createClass({
	statics: {
		title: "Horizontal Stacked Bar"
	},
	render() {
		return (
			<ContentSection title={HorizontalBarChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<HorizontalStackedBarChart data={this.props.horizontalGroupedBarData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/HORIZONTAL-STACKED-BAR-CHART')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default HorizontalBarChartPage;
