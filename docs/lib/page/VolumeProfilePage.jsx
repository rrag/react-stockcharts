'use strict';

import React from "react";
import { helper } from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import VolumeProfileChart from "lib/charts/VolumeProfileChart";
var { TypeChooser } = helper;


var VolumeProfilePage = React.createClass({
	statics: {
		title: "Volume profile"
	},
	render() {
		return (
			<ContentSection title={VolumeProfilePage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser ref="container">
							{(type) => (<VolumeProfileChart data={this.props.lotsOfData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/VOLUME-PROFILE")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default VolumeProfilePage;