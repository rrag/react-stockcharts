'use strict';

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartForDiscontinuousIntraDay from "lib/charts/CandleStickChartForDiscontinuousIntraDay";
var { TypeChooser } = helper;


var IntraDayContinuousDataPage = React.createClass({
	statics: {
		title: "Intra day with discontinuous scale"
	},
	render() {
		return (
			<ContentSection title={IntraDayContinuousDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartForDiscontinuousIntraDay data={this.props.intraDayDiscontinuousData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/INTRA-DAY-DISCONTINUOUS')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default IntraDayContinuousDataPage;