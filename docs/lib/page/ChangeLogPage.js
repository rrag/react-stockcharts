"use strict";

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

class ChangeLogPage extends React.Component {
	render() {
		return (
			<ContentSection title={ChangeLogPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/CHANGE-LOG") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

ChangeLogPage.title = "Change log";

export default ChangeLogPage;
