'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

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

module.exports = QuickStartExamplesPage;
