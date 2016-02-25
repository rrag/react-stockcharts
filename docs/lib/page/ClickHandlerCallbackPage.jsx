"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithClickHandlerCallback from "lib/charts/CandleStickChartWithClickHandlerCallback";

var { helper: { TypeChooser } } = ReStock;

var ClickHandlerCallbackPage = React.createClass({
	statics: {
		title: "Click callback"
	},
	render() {
		return (
			<ContentSection title={ClickHandlerCallbackPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CLICK-CALLBACK-INTERACTIVE-INDICATOR')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithClickHandlerCallback data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default ClickHandlerCallbackPage;
