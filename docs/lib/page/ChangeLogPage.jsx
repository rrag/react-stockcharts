'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

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

module.exports = BreakingChangesPage;
