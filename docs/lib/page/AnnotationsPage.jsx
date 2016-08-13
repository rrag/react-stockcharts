"use strict";

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithAnnotation from "lib/charts/CandleStickChartWithAnnotation";

var { TypeChooser } = helper;

var AnnotationsPage = React.createClass({
	statics: {
		title: "Annotations"
	},
	render() {
		return (
			<ContentSection title={AnnotationsPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithAnnotation  data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/ANNOTATIONS")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default AnnotationsPage;
