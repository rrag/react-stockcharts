'use strict';

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import VolumeProfileBySessionChart from "lib/charts/VolumeProfileBySessionChart";
var { TypeChooser } = helper;


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
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/VOLUME-PROFILE-BY-SESSION")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default VolumeProfileBySessionPage;