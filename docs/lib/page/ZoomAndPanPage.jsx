'use strict';

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithZoomPan from "lib/charts/CandleStickChartWithZoomPan";

var { TypeChooser } = helper;

var ZoomAndPanPage = React.createClass({
	statics: {
		title: 'Zoom and Pan'
	},
	render() {
		return (
			<ContentSection title={ZoomAndPanPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithZoomPan data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/ZOOM-AND-PAN')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default ZoomAndPanPage;
