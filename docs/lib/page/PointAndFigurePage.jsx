'use strict';

var React = require('react');
var ContentSection = require('lib/content-section');
var Row = require('lib/row');
var Section = require('lib/section');

var PointAndFigure = require('lib/charts/PointAndFigure');

var PointAndFigurePage = React.createClass({
	statics: {
		title: 'Point & Figure'
	},
	render() {
		return (
			<ContentSection title={PointAndFigurePage.title}>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require('md/POINT-AND-FIGURE')}}></aside>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<PointAndFigure data={this.props.someData} />
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = PointAndFigurePage;
