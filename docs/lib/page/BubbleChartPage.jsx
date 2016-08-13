'use strict';

import React from "react";
import { helper } from "react-stockcharts";
var { TypeChooser } = helper;

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import BubbleChart from "lib/charts/BubbleChart";

var BubbleChartPage = React.createClass({
	statics: {
		title: "Bubble Chart"
	},
	render() {
		return (
			<ContentSection title={BubbleChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<BubbleChart data={this.props.bubbleData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/BUBBLE-CHART')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default BubbleChartPage;
