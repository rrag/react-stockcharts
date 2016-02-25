'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import HaikinAshi from "lib/charts/HaikinAshi";

var { helper: { TypeChooser } } = ReStock;

var HeikinAshiPage = React.createClass({
	statics: {
		title: 'Heikin Ashi'
	},
	render() {
		return (
			<ContentSection title={HeikinAshiPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/HEIKIN-ASHI')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <HaikinAshi data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default HeikinAshiPage;
