'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var ComingSoonPage = React.createClass({
	statics: {
		title: 'Coming soon...'
	},
	render() {
		return (
			<ContentSection title={ComingSoonPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/COMING-SOON')}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = ComingSoonPage;
