

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import BubbleChart from "lib/charts/BubbleChart";

class BubbleChartPage extends React.Component {
	render() {
		return (
			<ContentSection title={BubbleChartPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<BubbleChart data={this.props.bubbleData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/BUBBLE-CHART") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

BubbleChartPage.title = "Bubble Chart";

export default BubbleChartPage;
