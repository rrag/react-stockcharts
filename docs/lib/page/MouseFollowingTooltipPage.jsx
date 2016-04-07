"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithHoverTooltip from "lib/charts/CandleStickChartWithHoverTooltip";

var { helper: { TypeChooser } } = ReStock;

var AnnotationsPage = React.createClass({
	statics: {
		title: "Hover Tooltip"
	},
	render() {
		return (
			<ContentSection title={AnnotationsPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithHoverTooltip  data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/HOVER-TOOLTIP")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default AnnotationsPage;
