'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var { helper: { TypeChooser } } = ReStock;

import LineAndScatterChart from "lib/charts/LineAndScatterChart";

var LineAndScatterChartPage = React.createClass({
	statics: {
		title: 'Line & Scatter'
	},
	render() {
		return (
			<ContentSection title={LineAndScatterChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<LineAndScatterChart data={this.props.compareData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/SCATTER-CHART')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default LineAndScatterChartPage;
