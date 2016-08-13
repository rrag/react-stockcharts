'use strict';

import React from "react";
import { helper } from "react-stockcharts";
var { TypeChooser } = helper;

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import GroupedBarChart from "lib/charts/GroupedBarChart";

var GroupedBarChartPage = React.createClass({
	statics: {
		title: "Grouped Bar Chart"
	},
	render() {
		return (
			<ContentSection title={GroupedBarChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<GroupedBarChart data={this.props.groupedBarData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/GROUPED-BAR-CHART')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default GroupedBarChartPage;
