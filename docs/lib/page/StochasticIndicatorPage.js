

import React from "react";
import ReactDOM from "react-dom";
import canvg from "canvg";
import { TypeChooser, SaveChartAsImage } from "react-stockcharts/lib/helper";

import ContentSection from "lib/content-section";
import Row from "lib/row";
import Section from "lib/section";

import CandleStickChartWithFullStochasticsIndicator from "lib/charts/CandleStickChartWithFullStochasticsIndicator";

class StochasticIndicatorPage extends React.Component {
	constructor(props) {
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.saveChartAsImage = this.saveChartAsImage.bind(this);
	}
	saveNode(node) {
		this.chart = node;
	}
	saveChartAsImage() {
		const container = ReactDOM.findDOMNode(this.chart); // eslint-disable-line react/no-find-dom-node
		SaveChartAsImage.saveChartAsImageWithOptions(container, { 
			canvg,
			background: "white"
		});
	}
	render() {
		return (
			<ContentSection title={StochasticIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<button type="button" className="btn btn-success btn-lg pull-right" onClick={this.saveChartAsImage} >
							<span className="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>
						</button>
						<TypeChooser>
							{type => <CandleStickChartWithFullStochasticsIndicator ref={this.saveNode} data={this.props.someData} type={type} />}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{ __html: require("md/STOCHASTIC-INDICATOR") }}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
}

StochasticIndicatorPage.title = "Stochastic Oscillator";

export default StochasticIndicatorPage;
