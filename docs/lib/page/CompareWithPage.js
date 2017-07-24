"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithCompare from "lib/charts/CandleStickChartWithCompare";

class CompareWithPage extends React.Component {
	render() {
		return (
			<ContentSection title={CompareWithPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <CandleStickChartWithCompare data={this.props.compareData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/COMPARE-WITH") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

CompareWithPage.title = "Compare";

export default CompareWithPage;
