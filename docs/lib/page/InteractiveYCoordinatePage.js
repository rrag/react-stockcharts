import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithInteractiveYCoordinate from "lib/charts/CandleStickChartWithInteractiveYCoordinate";

class InteractiveYCoordinatePage extends React.Component {
	render() {
		return (
			<ContentSection title={InteractiveYCoordinatePage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithInteractiveYCoordinate data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/INTERACTIVE-Y-COORDINATE") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

InteractiveYCoordinatePage.title = "Interactive Y Coordinate";

export default InteractiveYCoordinatePage;
