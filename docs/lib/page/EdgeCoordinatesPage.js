

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithEdge from "lib/charts/CandleStickChartWithEdge";

class EdgeCoordinatesPage extends React.Component {
	render() {
		return (
			<ContentSection title={EdgeCoordinatesPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => (<CandleStickChartWithEdge  data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/EDGE-COORDINATE") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

EdgeCoordinatesPage.title = "Edge coordinate";

export default EdgeCoordinatesPage;