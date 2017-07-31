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
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	MouseCoordinateY,
	MouseCoordinateX
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { InteractiveText } from "react-stockcharts/lib/interactive";
import { last } from "react-stockcharts/lib/utils";

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
		this.props.onSave(this.state.text);
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

class CandleStickChartWithText extends React.Component {
	constructor(props) {
		super(props);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onDrawComplete = this.onDrawComplete.bind(this);
		this.handleChoosePosition = this.handleChoosePosition.bind(this);
		this.saveInteractiveNode = this.saveInteractiveNode.bind(this);
		this.saveCanvasNode = this.saveCanvasNode.bind(this);

		this.handleDialogClose = this.handleDialogClose.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);

		this.state = {
			enableInteractiveObject: true,
			textList: [],
			showModal: false,
		};
	}
	saveInteractiveNode(node) {
		this.node = node;
	}
	saveCanvasNode(node) {
		this.canvasNode = node;
	}
	handleTextChange(text) {
		const { textList } = this.state;
		const allButLast = textList.slice(0, textList.length - 1);
		const lastText = {
			...last(textList),
			text,
		};

		this.setState({
			textList: [
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
	handleChoosePosition(text) {
		this.componentWillUnmount();
		this.setState({
			textList: [
				...this.state.textList,
				text
			],
			showModal: true,
			text: text.text
		});
	}
	componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyPress);
	}
	onDrawComplete(textList) {
		// this gets called on
		// 1. draw complete of drawing object
		// 2. drag complete of drawing object
		this.setState({
			enableInteractiveObject: false,
			textList
		});
	}
	onKeyPress(e) {
		const keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
		case 46: {
			// DEL
			this.setState({
				textList: this.state.textList.slice(
					0,
					this.state.textList.length - 1
				)
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
		case 69: {
				// E - Enable drawing object
			this.setState({
				enableInteractiveObject: true
			});
			break;
		}
		}
	}
	render() {
		const { type, data: initialData, width, ratio } = this.props;
		const { textList, showModal, text } = this.state;

		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
			d => d.date
		);
		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
			initialData
		);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<div>
				<ChartCanvas ref={this.saveCanvasNode}
					height={400}
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
					<Chart
						id={1}
						yExtents={[d => [d.high, d.low]]}
						padding={{ top: 10, bottom: 20 }}
					>

						<YAxis axisAt="right" orient="right" ticks={5} />
						<XAxis axisAt="bottom" orient="bottom" />

						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={format(".2f")}
						/>
						<MouseCoordinateX
							at="bottom"
							orient="bottom"
							displayFormat={timeFormat("%Y-%m-%d")}
						/>
						<CandlestickSeries />

						<EdgeIndicator
							itemType="last"
							orient="right"
							edgeAt="right"
							yAccessor={d => d.close}
							fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
						/>

						<OHLCTooltip origin={[-40, 0]} />

						<InteractiveText
							ref={this.saveInteractiveNode}
							enabled={this.state.enableInteractiveObject}
							text="Lorem ipsum..."
							onChoosePosition={this.handleChoosePosition}
							onDragComplete={this.onDrawComplete}
							textList={textList}
						/>
					</Chart>
					<CrossHairCursor />
				</ChartCanvas>
				<Dialog
					showModal={showModal}
					text={text}
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
