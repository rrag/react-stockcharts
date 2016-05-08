'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartForContiniousIntraDay from "lib/charts/CandleStickChartForContiniousIntraDay";
var { helper: { TypeChooser } } = ReStock;


var IntraDayContiniousDataPage = React.createClass({
	statics: {
		title: "Intra day with Continious scale"
	},
	render() {
		return (
			<ContentSection title={IntraDayContiniousDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartForContiniousIntraDay data={this.props.intraDayContiniousData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default IntraDayContiniousDataPage;