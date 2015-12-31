'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithCHMousePointer from "lib/charts/CandleStickChartWithCHMousePointer";

var MousePointerPage = React.createClass({
	statics: {
		title: 'Mouse pointer'
	},
	render() {
		return (
			<ContentSection title={MousePointerPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithCHMousePointer data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/MOUSEPOINTER')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default MousePointerPage;
