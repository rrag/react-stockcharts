'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartForDiscontinuousIntraDay from "lib/charts/CandleStickChartForDiscontinuousIntraDay";
var { helper: { TypeChooser } } = ReStock;


var IntraDayContiniousDataPage = React.createClass({
	statics: {
		title: "Intra day with discontinuous scale"
	},
	render() {
		return (
			<ContentSection title={IntraDayContiniousDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartForDiscontinuousIntraDay data={this.props.intraDayDiscontinuousData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default IntraDayContiniousDataPage;