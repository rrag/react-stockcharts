'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import Renko from "lib/charts/Renko";

var { helper: { TypeChooser } } = ReStock;

var RenkoPage = React.createClass({
	statics: {
		title: 'Renko'
	},
	render() {
		return (
			<ContentSection title={RenkoPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/RENKO')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <Renko data={this.props.lotsOfData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default RenkoPage;
