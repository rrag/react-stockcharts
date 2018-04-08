import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithInteractiveAlert from "lib/charts/CandleStickChartWithInteractiveAlert";

class InteractiveAlertPage extends React.Component {
	render() {
		return (
			<ContentSection title={InteractiveAlertPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithInteractiveAlert data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/INTERACTIVE-ALERT") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

InteractiveAlertPage.title = "Interactive Alert";

export default InteractiveAlertPage;
