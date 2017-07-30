import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithText from "lib/charts/CandleStickChartWithText";

class TextPage extends React.Component {
	render() {
		return (
			<ContentSection title={TextPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithText data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/INTERACTIVE-TEXT") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

TextPage.title = "Interactive text";

export default TextPage;
