'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

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

module.exports = CreatingCustomIndicatorPage;
