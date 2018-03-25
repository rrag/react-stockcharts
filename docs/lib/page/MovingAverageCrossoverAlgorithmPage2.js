

import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import MovingAverageCrossOverAlgorithmV2 from "lib/charts/MovingAverageCrossOverAlgorithmV2";

class MovingAverageCrossoverAlgorithmPage2 extends React.Component {
	render() {
		return (
			<ContentSection title={MovingAverageCrossoverAlgorithmPage2.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{type => <MovingAverageCrossOverAlgorithmV2  data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/MA-CROSSOVER-ALGORITHMV2") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

MovingAverageCrossoverAlgorithmPage2.title = "MA Crossover - Using svg shape";

export default MovingAverageCrossoverAlgorithmPage2;
