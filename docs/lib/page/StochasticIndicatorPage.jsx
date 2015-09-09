"use strict";

var React = require("react");
var ContentSection = require("lib/content-section");
var Row = require("lib/row");
var Section = require("lib/section");
var SaveChartAsImage = require("src/").helper.SaveChartAsImage;
var TypeChooser = require("src/").helper.TypeChooser;

var CandleStickChartWithFullStochasticsIndicator = require("lib/charts/CandleStickChartWithFullStochasticsIndicator");

var StochasticIndicatorPage = React.createClass({
	statics: {
		title: "Indicators - Stochastic Oscillator"
	},
	saveChartAsImage(e) {
		var container = React.findDOMNode(this.refs.container);
		var image = SaveChartAsImage.saveWithWhiteBG(document, React.findDOMNode(this.refs.container));

		var a = document.createElement("a");
		a.setAttribute("href", image);
		a.setAttribute("download", "Chart.png");
		document.body.appendChild(a);
		a.addEventListener("click", function(e) {
			a.parentNode.removeChild(a);
		});
		console.log("HEER");
		a.click();
	},
	render() {
		return (
			<ContentSection title={StochasticIndicatorPage.title}>
				<Row>
					<Section colSpan={2}>
						<button type="button" className="btn btn-success btn-lg pull-right" onClick={this.saveChartAsImage} >
							<span className="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>
						</button>
						<TypeChooser ref="container">
							{(type) => (<CandleStickChartWithFullStochasticsIndicator data={this.props.someData} type={type} />)}
						</TypeChooser>
					</Section>
				</Row>
				<Row>
					<Section colSpan={2}>
						<aside dangerouslySetInnerHTML={{__html: require("md/STOCHASTIC-INDICATOR")}}></aside>
					</Section>
				</Row>
			</ContentSection>
		);
	}
});

module.exports = StochasticIndicatorPage;
