"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import HorizontalBarChart from "lib/charts/HorizontalBarChart";

class HorizontalBarChartPage extends React.Component {
	render() {
		return (
			<ContentSection title={HorizontalBarChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<HorizontalBarChart data={this.props.horizontalBarData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/HORIZONTAL-BAR-CHART") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

HorizontalBarChartPage.title = "Horizontal Bar Chart";

export default HorizontalBarChartPage;
