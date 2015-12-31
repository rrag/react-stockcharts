'use strict';

import React from "react";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

var OverviewPage = React.createClass({
	statics: {
		title: 'Overview'
	},
	render() {
		return (
			<ContentSection title={OverviewPage.title}>
				<Row>
					<Section  colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/OVERVIEW')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default OverviewPage;
