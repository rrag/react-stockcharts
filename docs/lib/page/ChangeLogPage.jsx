'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var BreakingChangesPage = React.createClass({
	statics: {
		title: 'Change log'
	},
	render() {
		return (
			<ContentSection title={BreakingChangesPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CHANGE-LOG')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default BreakingChangesPage;
