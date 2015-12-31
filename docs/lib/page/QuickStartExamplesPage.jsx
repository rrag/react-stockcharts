'use strict';

import React from "react";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var QuickStartExamplesPage = React.createClass({
	statics: {
		title: 'Quick start Examples'
	},
	render() {
		return (
			<ContentSection title={QuickStartExamplesPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/QUICK-START-EXAMPLES')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default QuickStartExamplesPage;
