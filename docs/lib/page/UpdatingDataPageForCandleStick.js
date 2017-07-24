import React from "react";
import { TypeChooser } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithUpdatingData from "lib/charts/CandleStickChartWithUpdatingData";
import KagiWithUpdatingData from "lib/charts/KagiWithUpdatingData";
import PointAndFigureWithUpdatingData from "lib/charts/PointAndFigureWithUpdatingData";
import RenkoWithUpdatingData from "lib/charts/RenkoWithUpdatingData";

class UpdatingDataPageForCandleStick extends React.Component {
	render() {
		return (
			<ContentSection title={UpdatingDataPageForCandleStick.title}>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <CandleStickChartWithUpdatingData data={this.props.lotsOfData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/UPDATING-DATA") }}></aside>
					</Section>
				</Row>
				{/* <Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <KagiWithUpdatingData data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <PointAndFigureWithUpdatingData data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<TypeChooser>
							{(type) => <RenkoWithUpdatingData data={this.props.lotsOfData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>*/}
			</ContentSection>
		);
	}
}

UpdatingDataPageForCandleStick.title = "Updating Data";

export default UpdatingDataPageForCandleStick;
