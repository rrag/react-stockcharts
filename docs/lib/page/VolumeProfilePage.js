

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import VolumeProfileChart from "lib/charts/VolumeProfileChart";

class VolumeProfilePage extends React.Component {
	render() {
		return (
			<ContentSection title={VolumeProfilePage.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <VolumeProfileChart data={this.props.lotsOfData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/VOLUME-PROFILE") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

VolumeProfilePage.title = "Volume profile";

export default VolumeProfilePage;