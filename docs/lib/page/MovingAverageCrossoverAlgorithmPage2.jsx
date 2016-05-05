"use strict";

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import MovingAverageCrossOverAlgorithmV2 from "lib/charts/MovingAverageCrossOverAlgorithmV2";

var { helper: { TypeChooser } } = ReStock;

var MovingAverageCrossoverAlgorithmPage2 = React.createClass({
	statics: {
		title: "MA Crossover - Using svg shape"
	},
	render() {
		return (
			<ContentSection title={MovingAverageCrossoverAlgorithmPage2.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<MovingAverageCrossOverAlgorithmV2  data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/MA-CROSSOVER-ALGORITHMV2")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default MovingAverageCrossoverAlgorithmPage2;
