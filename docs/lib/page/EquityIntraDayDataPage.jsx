'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartForDiscontiniousIntraDay from "lib/charts/CandleStickChartForDiscontiniousIntraDay";
var { helper: { TypeChooser } } = ReStock;


var IntraDayContiniousDataPage = React.createClass({
	statics: {
		title: "Intra day with discontinious scale"
	},
	render() {
		return (
			<ContentSection title={IntraDayContiniousDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartForDiscontiniousIntraDay data={this.props.intraDayDiscontiniousData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default IntraDayContiniousDataPage;