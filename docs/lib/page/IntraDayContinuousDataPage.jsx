'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartForContinuousIntraDay from "lib/charts/CandleStickChartForContinuousIntraDay";
var { helper: { TypeChooser } } = ReStock;


var IntraDayContinuousDataPage = React.createClass({
	statics: {
		title: "Intra day with Continuous scale"
	},
	render() {
		return (
			<ContentSection title={IntraDayContinuousDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartForContinuousIntraDay data={this.props.intraDayContinuousData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/INTRA-DAY-CONTINUOUS')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default IntraDayContinuousDataPage;