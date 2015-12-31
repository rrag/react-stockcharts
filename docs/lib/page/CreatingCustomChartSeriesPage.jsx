'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var CreatingCustomChartSeriesPage = React.createClass({
	statics: {
		title: 'Custom - Create XXXSeries'
	},
	render() {
		return (
			<ContentSection title={CreatingCustomChartSeriesPage.title}>
				<Row>
					<Section  colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CREATE-CUSTOM-SERIES')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default CreatingCustomChartSeriesPage;
