'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartForIntraDay from "lib/charts/CandleStickChartForIntraDay";
var { helper: { TypeChooser } } = ReStock;


var IntraDayDataPage = React.createClass({
	statics: {
		title: "Intra day with Continious scale"
	},
	render() {
		return (
			<ContentSection title={IntraDayDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartForIntraDay data={this.props.intraDayData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default IntraDayDataPage;