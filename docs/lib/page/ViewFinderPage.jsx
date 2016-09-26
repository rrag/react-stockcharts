"use strict";

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithViewFinder from "lib/charts/CandleStickChartWithViewFinder";

var { TypeChooser } = helper;


class ViewFinderPage extends React.Component {
	render() {
		return (
			<ContentSection title={ViewFinderPage.title}>
				<Row>
					<Section  colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/VIEW-FINDER") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<CandleStickChartWithViewFinder data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

ViewFinderPage.title = "View finder";

export default ViewFinderPage;
