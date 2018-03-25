

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import HorizontalStackedBarChart from "lib/charts/HorizontalStackedBarChart";

class HorizontalBarChartPage extends React.Component {
	render() {
		return (
			<ContentSection title={HorizontalBarChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<HorizontalStackedBarChart data={this.props.horizontalGroupedBarData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/HORIZONTAL-STACKED-BAR-CHART") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

HorizontalBarChartPage.title = "Horizontal Stacked Bar";

export default HorizontalBarChartPage;
