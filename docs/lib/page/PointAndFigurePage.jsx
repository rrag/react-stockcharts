'use strict';

import React from "react";
import ReStock from "react-stockcharts";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import PointAndFigure from "lib/charts/PointAndFigure";

var { helper: { TypeChooser } } = ReStock;

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
						<TypeChooser>
							{(type) => <PointAndFigure data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

export default PointAndFigurePage;
