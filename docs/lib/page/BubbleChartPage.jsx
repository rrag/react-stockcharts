'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var { helper: { TypeChooser } } = ReStock;

import BubbleChart from "lib/charts/BubbleChart";

var bubbleData = require("data/bubble.json");

var BubbleChartPage = React.createClass({
	statics: {
		title: 'Bubble Chart'
	},
	render() {
		return (
			<ContentSection title={BubbleChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<BubbleChart data={bubbleData} type={type} />)}
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
