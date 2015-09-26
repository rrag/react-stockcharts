'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var Kagi = require('lib/charts/Kagi');
var TypeChooser = require("src/").helper.TypeChooser;

var KagiPage = React.createClass({
	statics: {
		title: 'Kagi'
	},
	render() {
		return (
			<ContentSection title={KagiPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/KAGI')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <Kagi data={this.props.lotsOfData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = KagiPage;
