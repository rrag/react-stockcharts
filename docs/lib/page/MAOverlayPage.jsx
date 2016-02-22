'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithMA from "lib/charts/CandleStickChartWithMA";

var MAOverlayPage = React.createClass({
	statics: {
		title: 'Moving Average'
	},
	render() {
		return (
			<ContentSection title={MAOverlayPage.title}>
				<Row>
					<Section colSpan={2}>
						<CandleStickChartWithMA data={this.props.someData} type="svg" />
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/MOVING-AVERAGE-OVERLAY')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default MAOverlayPage;
