"use strict";

import React from "react";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

class OverviewPage extends React.Component {
	render() {
		return (
			<ContentSection title={OverviewPage.title}>
				<Row>
					<Section  colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/OVERVIEW") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

OverviewPage.title = "Overview";

export default OverviewPage;
