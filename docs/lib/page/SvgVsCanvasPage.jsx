'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithZoomPan from "lib/charts/CandleStickChartWithZoomPan";

var { helper: { TypeChooser } } = ReStock;

var SvgVsCanvasPage = React.createClass({
	statics: {
		title: 'Svg vs Canvas'
	},
	render() {
		return (
			<ContentSection title={SvgVsCanvasPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/SVG-VS-CANVAS')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser type="svg">
							{(type) => <CandleStickChartWithZoomPan data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default SvgVsCanvasPage;
