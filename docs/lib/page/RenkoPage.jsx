'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var Renko = require('lib/charts/Renko');

var RenkoPage = React.createClass({
	statics: {
		title: 'Renko'
	},
	render() {
		return (
			<ContentSection title={RenkoPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/RENKO')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<Renko data={this.props.lotsOfData} />
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = RenkoPage;
