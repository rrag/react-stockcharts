"use strict";

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithDarkTheme from "lib/charts/CandleStickChartWithDarkTheme";

var { TypeChooser } = helper;


var DarkThemePage = React.createClass({
	statics: {
		title: "Theme - Dark"
	},
	saveChartAsImage(e) {
		var container = React.findDOMNode(this.refs.container);
		SaveChartAsImage.saveChartAsImage(container);
	},
	render() {
		return (
			<ContentSection title={DarkThemePage.title}>
				<Row>
					<Section  colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/DARK-THEME')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2} className="dark">
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithDarkTheme data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default DarkThemePage;
