'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithZoomPan from "lib/charts/CandleStickChartWithZoomPan";

var ZoomAndPanPage = React.createClass({
	statics: {
		title: 'Zoom and Pan'
	},
	render() {
		return (
			<ContentSection title={ZoomAndPanPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithZoomPan data={this.props.someData} type="svg" />
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
