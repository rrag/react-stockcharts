"use strict";

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import VolumeProfileBySessionChart from "lib/charts/VolumeProfileBySessionChart";

class VolumeProfileBySessionPage extends React.Component {
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
						<aside dangerouslySetInnerHTML={{ __html: require("md/VOLUME-PROFILE-BY-SESSION") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

VolumeProfileBySessionPage.title = "Volume profile by Session";

export default VolumeProfileBySessionPage;