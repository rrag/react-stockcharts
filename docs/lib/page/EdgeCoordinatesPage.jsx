'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithEdge from "lib/charts/CandleStickChartWithEdge";
var { helper: { TypeChooser } } = ReStock;

var EdgeCoordinatesPage = React.createClass({
	statics: {
		title: 'Edge coordinate'
	},
	render() {
		return (
			<ContentSection title={EdgeCoordinatesPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithEdge  data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/EDGE-COORDINATE')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default EdgeCoordinatesPage;