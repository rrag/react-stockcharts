'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var GettingStartedPage = React.createClass({
	statics: {
		title: 'Getting Started'
	},
	render() {
		return (
			<ContentSection title={GettingStartedPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/GETTING-STARTED')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = GettingStartedPage;

/*
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('README')}}></aside>
					</Section>
				</Row>
*/
