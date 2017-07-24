"use strict";

import React from "react";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

class GettingStartedPage extends React.Component {
	render() {
		return (
			<ContentSection title={GettingStartedPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/GETTING-STARTED") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

GettingStartedPage.title = "Getting Started";

export default GettingStartedPage;
