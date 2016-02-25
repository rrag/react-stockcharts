'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import Kagi from "lib/charts/Kagi";

var { helper: { TypeChooser } } = ReStock;

var KagiPage = React.createClass({
	statics: {
		title: 'Kagi'
	},
	render() {
		return (
			<ContentSection title={KagiPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/KAGI')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <Kagi data={this.props.lotsOfData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default KagiPage;
