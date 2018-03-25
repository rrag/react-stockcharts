

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import AreaChartWithZoomPan from "lib/charts/AreaChartWithZoomPan";

class MiscChartsPage extends React.Component {
	render() {
		return (
			<ContentSection title={MiscChartsPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/SINGLE-VALUE-TOOLTIP") }}></aside>
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
}

MiscChartsPage.title = "Misc Charts";

export default MiscChartsPage;
