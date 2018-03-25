

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithEquidistantChannel from "lib/charts/CandleStickChartWithEquidistantChannel";

class EquidistantChannelPage extends React.Component {
	render() {
		return (
			<ContentSection title={EquidistantChannelPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/EQUIDISTANT-CHANNEL") }}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithEquidistantChannel data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

EquidistantChannelPage.title = "Equidistant Channel";

export default EquidistantChannelPage;
