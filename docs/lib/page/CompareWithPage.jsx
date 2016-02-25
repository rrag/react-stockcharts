'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var { helper: { TypeChooser } } = ReStock;

import CandleStickChartWithCompare from "lib/charts/CandleStickChartWithCompare";

var CompareWithPage = React.createClass({
	statics: {
		title: 'Compare'
	},
	render() {
		return (
			<ContentSection title={CompareWithPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithCompare data={this.props.compareData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/COMPARE-WITH')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default CompareWithPage;
