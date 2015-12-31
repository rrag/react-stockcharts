'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithEdge from "lib/charts/CandleStickChartWithEdge";

var EdgeCoordinatesPage = React.createClass({
	statics: {
		title: 'Edge coordinate'
	},
	render() {
		return (
			<ContentSection title={EdgeCoordinatesPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithEdge  data={this.props.someData} type="svg"/>
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
