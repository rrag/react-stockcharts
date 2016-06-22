'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import VolumeProfileBySessionChart from "lib/charts/VolumeProfileBySessionChart";
var { helper: { TypeChooser } } = ReStock;


var VolumeProfileBySessionPage = React.createClass({
	statics: {
		title: "Volume profile by Session"
	},
	render() {
		return (
			<ContentSection title={VolumeProfileBySessionPage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<VolumeProfileBySessionChart data={this.props.lotsOfData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default VolumeProfileBySessionPage;