'use strict';

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithEdge from "lib/charts/CandleStickChartWithEdge";

var { TypeChooser } = helper;

var LotsOfDataPage = React.createClass({
	statics: {
		title: 'Lots of data'
	},
	render() {
		return (
			<ContentSection title={LotsOfDataPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/LOTS-OF-DATA')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <CandleStickChartWithEdge data={this.props.lotsOfData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default LotsOfDataPage;
