import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import shortid from "shortid";
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
	MouseCoordinateXV2,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip, MACDTooltip } from "react-stockcharts/lib/tooltip";
import { macd } from "react-stockcharts/lib/indicator";

import { fitWidth } from "react-stockcharts/lib/helper";
import { InteractiveYCoordinate, DrawingObjectSelector } from "react-stockcharts/lib/interactive";
import { getMorePropsForChart } from "react-stockcharts/lib/interactive/utils";
import { head, last, toObject } from "react-stockcharts/lib/utils";
import {
	saveInteractiveNodes,
	getInteractiveNodes,
} from "./interactiveutils";

function round(number, precision = 0) {
	const d = Math.pow(10, precision);
	return Math.round(number * d) / d;
}

class Dialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			alert: props.alert,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			alert: nextProps.alert,
		});
	}
	handleChange(e) {
		const { alert } = this.state;
		this.setState({
			alert: {
				...alert,
				yValue: Number(e.target.value),
			}
		});
	}
	handleSave() {
		this.props.onSave(this.state.alert, this.props.chartId);
	}
	render() {
		const {
			showModal,
			onClose,
			onDeleteAlert,
		} = this.props;
		const { alert } = this.state;

		if (!showModal) return null;
		return (
			<Modal show={showModal} onHide={onClose} >
				<Modal.Header closeButton>
					<Modal.Title>Edit Alert</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<form>
						<FormGroup controlId="text">
							<ControlLabel>Alert when crossing</ControlLabel>
							<FormControl type="number" value={alert.yValue} onChange={this.handleChange} />
						</FormGroup>
					</form>
				</Modal.Body>

				<Modal.Footer>
					<Button bsStyle="danger" onClick={onDeleteAlert}>Delete Alert</Button>
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

const alert = InteractiveYCoordinate.defaultProps.defaultPriceCoordinate;
const sell = {
	...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
	stroke: "#E3342F",
	textFill: "#E3342F",
	text: "Sell 320",
	edge: {
		...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.edge,
		stroke: "#E3342F"
	}
};
const buy = {
	...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
	stroke: "#1F9D55",
	textFill: "#1F9D55",
	text: "Buy 120",
	edge: {
		...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate.edge,
		stroke: "#1F9D55"
	}
};

class CandleStickChartWithInteractiveYCoordinate extends React.Component {
	constructor(props) {
		super(props);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onDragComplete = this.onDragComplete.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.handleChoosePosition = this.handleChoosePosition.bind(this);

		this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
		this.getInteractiveNodes = getInteractiveNodes.bind(this);

		this.handleSelection = this.handleSelection.bind(this);

		this.saveCanvasNode = this.saveCanvasNode.bind(this);

		this.handleDialogClose = this.handleDialogClose.bind(this);
		this.handleChangeAlert = this.handleChangeAlert.bind(this);
		this.handleDeleteAlert = this.handleDeleteAlert.bind(this);

		this.handleDoubleClickAlert = this.handleDoubleClickAlert.bind(this);

		this.state = {
			enableInteractiveObject: false,
			yCoordinateList_1: [
				{
					...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
					yValue: 55.90,
					id: shortid.generate(),
					draggable: true,
				},
				{
					...buy,
					yValue: 50.90,
					id: shortid.generate(),
					draggable: false,
				},
				{
					...sell,
					yValue: 58.90,
					id: shortid.generate(),
					draggable: false,
				},
			],
			yCoordinateList_3: [],
			showModal: false,
			alertToEdit: {}
		};
	}
	saveCanvasNode(node) {
		this.canvasNode = node;
	}
	handleSelection(interactives, moreProps, e) {
		if (this.state.enableInteractiveObject) {
			const independentCharts = moreProps.currentCharts.filter(d => d !== 2);
			if (independentCharts.length > 0) {
				const first = head(independentCharts);

				const morePropsForChart = getMorePropsForChart(moreProps, first);
				const {
					mouseXY: [, mouseY],
					chartConfig: { yScale },
				} = morePropsForChart;

				const yValue = round(yScale.invert(mouseY), 2);
				const newAlert = {
					...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
					yValue,
					id: shortid.generate()
				};
				this.handleChoosePosition(newAlert, morePropsForChart, e);
			}
		} else {
			const state = toObject(interactives, each => {
				return [
					`yCoordinateList_${each.chartId}`,
					each.objects,
				];
			});
			this.setState(state);
		}
	}
	handleChoosePosition(alert, moreProps) {
		const { id: chartId } = moreProps.chartConfig;
		this.setState({
			[`yCoordinateList_${chartId}`]: [
				...this.state[`yCoordinateList_${chartId}`],
				alert
			],
			enableInteractiveObject: false,
		});
	}
	handleDoubleClickAlert(item) {
		this.setState({
			showModal: true,
			alertToEdit: {
				alert: item.object,
				chartId: item.chartId,
			},
		});
	}
	handleChangeAlert(alert, chartId) {
		const yCoordinateList = this.state[`yCoordinateList_${chartId}`];
		const newAlertList = yCoordinateList.map(d => {
			return d.id === alert.id ? alert : d;
		});

		this.setState({
			[`yCoordinateList_${chartId}`]: newAlertList,
			showModal: false,
			enableInteractiveObject: false,
		});
	}
	handleDeleteAlert() {
		const { alertToEdit } = this.state;
		const key = `yCoordinateList_${alertToEdit.chartId}`;
		const yCoordinateList = this.state[key].filter(d => {
			return d.id !== alertToEdit.alert.id;
		});
		this.setState({
			showModal: false,
			alertToEdit: {},
			[key]: yCoordinateList
		});
	}
	handleDialogClose() {
		// cancel alert edit
		this.setState(state => {
			const { originalAlertList, alertToEdit } = state;
			const key = `yCoordinateList_${alertToEdit.chartId}`;
			const list = originalAlertList || state[key];

			return {
				showModal: false,
				[key]: list,
			};
		});
	}
	componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyPress);
	}
	onDelete(yCoordinate, moreProps) {
		this.setState(state => {
			const chartId = moreProps.chartConfig.id;
			const key = `yCoordinateList_${chartId}`;

			const list = state[key];
			return {
				[key]: list.filter(d => d.id !== yCoordinate.id)
			};
		});
	}
	onDragComplete(yCoordinateList, moreProps, draggedAlert) {
		// this gets called on drag complete of drawing object
		const { id: chartId } = moreProps.chartConfig;

		const key = `yCoordinateList_${chartId}`;
		const alertDragged = draggedAlert != null;

		this.setState({
			enableInteractiveObject: false,
			[key]: yCoordinateList,
			showModal: alertDragged,
			alertToEdit: {
				alert: draggedAlert,
				chartId,
			},
			originalAlertList: this.state[key],
		});
	}
	onKeyPress(e) {
		const keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
			case 46: {
				// DEL
				this.setState({
					yCoordinateList_1: this.state.yCoordinateList_1.filter(d => !d.selected),
					yCoordinateList_3: this.state.yCoordinateList_3.filter(d => !d.selected)
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
		const { showModal, alertToEdit } = this.state;

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

		// console.log(this.state)
		return (
			<div style={{ position: "relative" }}>
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

						<InteractiveYCoordinate
							ref={this.saveInteractiveNodes("InteractiveYCoordinate", 1)}
							enabled={this.state.enableInteractiveObject}
							onDragComplete={this.onDragComplete}
							onDelete={this.onDelete}
							yCoordinateList={this.state.yCoordinateList_1}
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

						<MouseCoordinateXV2
							at="bottom"
							orient="bottom"
							displayFormat={timeFormat("%Y-%m-%d")} />
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={format(".2f")} />

						<MACDSeries yAccessor={d => d.macd}
							{...macdAppearance} />

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
							InteractiveYCoordinate: "yCoordinateList"
						}}
						onSelect={this.handleSelection}
						onDoubleClick={this.handleDoubleClickAlert}
					/>
				</ChartCanvas>
				<Dialog
					showModal={showModal}
					alert={alertToEdit.alert}
					chartId={alertToEdit.chartId}
					onClose={this.handleDialogClose}
					onSave={this.handleChangeAlert}
					onDeleteAlert={this.handleDeleteAlert}
				/>
			</div>
		);
	}
}


CandleStickChartWithInteractiveYCoordinate.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithInteractiveYCoordinate.defaultProps = {
	type: "svg"
};

const CandleStickChart = fitWidth(
	CandleStickChartWithInteractiveYCoordinate
);

export default CandleStickChart;
