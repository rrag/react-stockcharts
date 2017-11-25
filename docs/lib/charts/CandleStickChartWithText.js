import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import {
	Modal,
	Button,
	FormGroup,
	ControlLabel,
	FormControl,
} from "react-bootstrap";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries, BarSeries, MACDSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	MouseCoordinateY,
	MouseCoordinateX
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip, MACDTooltip } from "react-stockcharts/lib/tooltip";
import { macd } from "react-stockcharts/lib/indicator";

import { fitWidth } from "react-stockcharts/lib/helper";
import { InteractiveText, DrawingObjectSelector } from "react-stockcharts/lib/interactive";
import { getMorePropsForChart } from "react-stockcharts/lib/interactive/utils";
import { head, last, toObject } from "react-stockcharts/lib/utils";
import {
	saveInteractiveNodes,
	getInteractiveNodes,
} from "./interactiveutils";

class Dialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: props.text,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			text: nextProps.text,
		});
	}
	handleChange(e) {
		this.setState({
			text: e.target.value
		});
	}
	handleSave() {
		this.props.onSave(this.state.text, this.props.chartId);
	}
	render() {
		const {
			showModal,
			onClose,
		} = this.props;
		const { text } = this.state;

		return (
			<Modal show={showModal} onHide={onClose} >
				<Modal.Header closeButton>
					<Modal.Title>Edit text</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<form>
						<FormGroup controlId="text">
							<ControlLabel>Text</ControlLabel>
							<FormControl type="text" value={text} onChange={this.handleChange} />
						</FormGroup>
					</form>
				</Modal.Body>

				<Modal.Footer>
					<Button bsStyle="primary" onClick={this.handleSave}>Save</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
const macdAppearance = {
	stroke: {
		macd: "#FF0000",
		signal: "#00F300",
	},
	fill: {
		divergence: "#4682B4"
	},
};

class CandleStickChartWithText extends React.Component {
	constructor(props) {
		super(props);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onDrawComplete = this.onDrawComplete.bind(this);
		this.handleChoosePosition = this.handleChoosePosition.bind(this);

		this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
		this.getInteractiveNodes = getInteractiveNodes.bind(this);

		this.handleSelection = this.handleSelection.bind(this);

		this.saveCanvasNode = this.saveCanvasNode.bind(this);

		this.handleDialogClose = this.handleDialogClose.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);

		this.state = {
			enableInteractiveObject: true,
			textList_1: [],
			textList_3: [],
			showModal: false,
		};
	}
	saveCanvasNode(node) {
		this.canvasNode = node;
	}
	handleSelection(interactives, moreProps, e) {
		if (this.state.enableInteractiveObject) {
			const independentCharts = moreProps.currentCharts.filter(d => d !== 2)
			if (independentCharts.length > 0) {
				const first = head(independentCharts);

				const morePropsForChart = getMorePropsForChart(moreProps, first)
				const {
					mouseXY: [, mouseY],
					chartConfig: { yScale },
					xAccessor,
					currentItem,
				} = morePropsForChart;

				const position = [xAccessor(currentItem), yScale.invert(mouseY)];
				const newText = {
					...InteractiveText.defaultProps.defaultText,
					position,
				};
				this.handleChoosePosition(newText, morePropsForChart, e);
			}
		} else {
			const state = toObject(interactives, each => {
				return [
					`textList_${each.chartId}`,
					each.objects,
				];
			});
			this.setState(state);
		}
	}
	handleChoosePosition(text, moreProps) {
		this.componentWillUnmount();
		const { id: chartId } = moreProps.chartConfig;

		this.setState({
			[`textList_${chartId}`]: [
				...this.state[`textList_${chartId}`],
				text
			],
			showModal: true,
			text: text.text,
			chartId
		});
	}
	handleTextChange(text, chartId) {
		const textList = this.state[`textList_${chartId}`];
		const allButLast = textList
			.slice(0, textList.length - 1);

		const lastText = {
			...last(textList),
			text,
		};

		this.setState({
			[`textList_${chartId}`]: [
				...allButLast,
				lastText
			],
			showModal: false,
			enableInteractiveObject: false,
		});
		this.componentDidMount();
	}
	handleDialogClose() {
		this.setState({
			showModal: false,
		});
		this.componentDidMount();
	}

	componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyPress);
	}
	onDrawComplete(textList, moreProps) {
		// this gets called on
		// 1. draw complete of drawing object
		// 2. drag complete of drawing object
		const { id: chartId } = moreProps.chartConfig;

		this.setState({
			enableInteractiveObject: false,
			[`textList_${chartId}`]: textList,
		});
	}
	onKeyPress(e) {
		const keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
		case 46: {
			// DEL
			this.setState({
				textList_1: this.state.textList_1.filter(d => !d.selected),
				textList_3: this.state.textList_3.filter(d => !d.selected)
			});
			break;
		}
		case 27: {
			// ESC
			this.node.terminate();
			this.canvasNode.cancelDrag();
			this.setState({
				enableInteractiveObject: false
			});
			break;
		}
		case 68: // D - Draw drawing object
		case 69: { // E - Enable drawing object
			this.setState({
				enableInteractiveObject: true
			});
			break;
		}
		}
	}
	render() {
		const macdCalculator = macd()
			.options({
				fast: 12,
				slow: 26,
				signal: 9,
			})
			.merge((d, c) => {d.macd = c;})
			.accessor(d => d.macd);

		const { type, data: initialData, width, ratio } = this.props;
		const { showModal, text } = this.state;

		const calculatedData = macdCalculator(initialData);
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);

		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<div>
				<ChartCanvas ref={this.saveCanvasNode}
					height={600}
					width={width}
					ratio={ratio}
					margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
					type={type}
					seriesName="MSFT"
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xExtents={xExtents}
				>
					<Chart id={1} height={400}
						yExtents={[d => [d.high, d.low]]}
						padding={{ top: 10, bottom: 20 }}
					>
						<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
						<YAxis axisAt="right" orient="right" ticks={5} />
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={format(".2f")} />

						<CandlestickSeries />

						<EdgeIndicator itemType="last" orient="right" edgeAt="right"
							yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

						<OHLCTooltip origin={[-40, 0]}/>

						<InteractiveText
							ref={this.saveInteractiveNodes("InteractiveText", 1)}
							enabled={this.state.enableInteractiveObject}
							text="Lorem ipsum..."
							onDragComplete={this.onDrawComplete}
							textList={this.state.textList_1}
						/>

					</Chart>
					<Chart id={2} height={150}
						yExtents={[d => d.volume]}
						origin={(w, h) => [0, h - 300]}
					>
						<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>

						<MouseCoordinateY
							at="left"
							orient="left"
							displayFormat={format(".4s")} />

						<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					</Chart>
					<Chart id={3} height={150}
						yExtents={macdCalculator.accessor()}
						origin={(w, h) => [0, h - 150]}
						padding={{ top: 10, bottom: 10 }}
					>
						<XAxis axisAt="bottom" orient="bottom"/>
						<YAxis axisAt="right" orient="right" ticks={2} />

						<MouseCoordinateX
							at="bottom"
							orient="bottom"
							displayFormat={timeFormat("%Y-%m-%d")} />
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={format(".2f")} />

						<MACDSeries yAccessor={d => d.macd}
							{...macdAppearance} />

						<InteractiveText
							ref={this.saveInteractiveNodes("InteractiveText", 3)}
							enabled={this.state.enableInteractiveObject}
							text="Lorem ipsum..."
							onDragComplete={this.onDrawComplete}
							textList={this.state.textList_3}
						/>

						<MACDTooltip
							origin={[-38, 15]}
							yAccessor={d => d.macd}
							options={macdCalculator.options()}
							appearance={macdAppearance}
						/>
					</Chart>
					<CrossHairCursor />
					<DrawingObjectSelector
						enabled
						getInteractiveNodes={this.getInteractiveNodes}
						drawingObjectMap={{
							InteractiveText: "textList"
						}}
						onSelect={this.handleSelection}
					/>
				</ChartCanvas>
				<Dialog
					showModal={showModal}
					text={text}
					chartId={this.state.chartId}
					onClose={this.handleDialogClose}
					onSave={this.handleTextChange}
				/>
			</div>
		);
	}
}


CandleStickChartWithText.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithText.defaultProps = {
	type: "svg"
};

const CandleStickChart = fitWidth(
	CandleStickChartWithText
);

export default CandleStickChart;
