'use strict';

import React from "react";
import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var CreatingCustomIndicatorPage = React.createClass({
	statics: {
		title: 'Custom - Create indicator'
	},
	render() {
		return (
			<ContentSection title={CreatingCustomIndicatorPage.title}>
				<Row>
					<Section  colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/CREATE-CUSTOM-INDICATOR')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default CreatingCustomIndicatorPage;
