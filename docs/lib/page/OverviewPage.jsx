'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

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

module.exports = OverviewPage;
