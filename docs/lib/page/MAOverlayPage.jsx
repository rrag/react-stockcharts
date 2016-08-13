'use strict';

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithMA from "lib/charts/CandleStickChartWithMA";

var { TypeChooser } = helper;

var MAOverlayPage = React.createClass({
	statics: {
		title: 'Moving Average'
	},
	render() {
		return (
			<ContentSection title={MAOverlayPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser type="hybrid">
							{(type) => <CandleStickChartWithMA data={this.props.someData} type={type} />}
						</TypeChooser>
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
