"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithBrush from "lib/charts/CandleStickChartWithBrush";

var { helper: { TypeChooser } } = ReStock;


var BrushSupportPage = React.createClass({
	statics: {
		title: "Brush"
	},
	render() {
		return (
			<ContentSection title={BrushSupportPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/BRUSH-INTERACTIVE-INDICATOR')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithBrush data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default BrushSupportPage;
