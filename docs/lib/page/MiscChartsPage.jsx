'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import AreaChartWithZoomPan from "lib/charts/AreaChartWithZoomPan";

var { helper: { TypeChooser } } = ReStock;

var MiscChartsPage = React.createClass({
	statics: {
		title: 'Misc Charts'
	},
	render() {
		return (
			<ContentSection title={MiscChartsPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/SINGLE-VALUE-TOOLTIP')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <AreaChartWithZoomPan data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default MiscChartsPage;
