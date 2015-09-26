'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');
var TypeChooser = require("src/").helper.TypeChooser;

var HaikinAshi = require('lib/charts/HaikinAshi');

var HeikinAshiPage = React.createClass({
	statics: {
		title: 'Heikin Ashi'
	},
	render() {
		return (
			<ContentSection title={HeikinAshiPage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/HEIKIN-ASHI')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <HaikinAshi data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = HeikinAshiPage;
