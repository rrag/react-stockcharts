"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";
import { isDefined , capitalizeFirst, noop } from "../utils";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}


export default function makeInteractive(InteractiveComponent, initialState) {

	class InteractiveComponentWrapper extends Component {
		constructor(props) {
			super(props);
			// this.subscription = this.subscription.bind(this);
			this.updateInteractiveState = this.updateInteractiveState.bind(this);
			// var { subscribe, chartId } = props;

			// this.subscriptionIds = subscription.map(each => subscribe(chartId, each, this.subscription.bind(this, each)));
			this.panHandler = this.panHandler.bind(this);
			this.overrideInteractive = this.overrideInteractive.bind(this);
		}
		panHandler(propOverride) {
			var { forChart, id, getInteractiveState } = this.props;
			var { chartConfig } = propOverride;

			var singleChartConfig = chartConfig.filter(each => each.id === forChart)[0];

			this.setState({
				...propOverride,
				chartConfig: singleChartConfig,
				interactiveState: getInteractiveState(forChart, id, initialState),
			});
		}
		updateInteractiveState(interactive) {
			var { setInteractiveState, id, forChart } = this.props;
			setInteractiveState(id, forChart, interactive);
		}
		overrideInteractive(newInteractiveState, callback = noop) {
			this.updateInteractiveState(newInteractiveState);

			this.setState({
				interactiveState: newInteractiveState
			}, callback)
		}
		overrideInteractive22(idx, override, callback = noop) {
			var { interactiveState } = this.state;
			var trend = interactiveState.trends[idx];
			var newTrend = trend;
			var { x1, y1, x2, y2 } = override;
			if (isDefined(x1) && isDefined(y1)) {
				newTrend = {
					start: [x1, y1],
					end: trend.end
				}
			} else if (isDefined(x2) && isDefined(y2)) {
				newTrend = {
					start: trend.start,
					end: [x2, y2],
				}
			}
			var newTrends = interactiveState.trends
				.map((each, i) => (i === idx) ? newTrend : each)

			var newInteractiveState = {
				trends: newTrends
			}

			this.updateInteractiveState(newInteractiveState);

			this.setState({
				interactiveState: newInteractiveState
			}, callback)
		}
		componentWillMount() {
			this.componentWillReceiveProps(this.props);
		}
		componentWillReceiveProps(nextProps) {
			var { plotData, xScale, chartConfig, forChart, id, getInteractiveState } = nextProps;
			var { mouseXY, currentItem, currentCharts, eventMeta } = nextProps;

			var singleChartConfig = chartConfig.filter(each => each.id === forChart)[0];
			var interactiveState = getInteractiveState(forChart, id, initialState);

			var newState = {
				xScale,
				plotData,
				mouseXY,
				currentCharts,
				currentItem,
				chartConfig: singleChartConfig,
				interactiveState,
				eventMeta,
			};

			if (isDefined(eventMeta)) {
				eventMeta.type.forEach(each => {
					var invoke = this.refs.interactive["on" + capitalizeFirst(each)];
					if (isDefined(invoke)) {
						interactiveState = invoke(newState);
					}
				})
			}

			this.updateInteractiveState(interactiveState)

			this.setState({
				...newState,
				interactiveState
			});

			var { id, chartCanvasType, callbackForCanvasDraw, getAllCanvasDrawCallback } = nextProps;

			if (chartCanvasType !== "svg") {
				var temp = getAllCanvasDrawCallback().filter(each => each.type === "annotation").filter(each => each.id === id);
				if (temp.length === 0) {
					callbackForCanvasDraw({
						id,
						type: "annotation",
						draw: this.panHandler,
					});
				} else {
					callbackForCanvasDraw(temp[0], {
						id,
						type: "annotation",
						draw: this.panHandler,
					});
				}
			}
		}
		removeLast() {
			var { id, forChart, getInteractiveState } = this.props;
			var interactive = getInteractiveState(forChart, id, initialState);

			if (this.refs.interactive.removeLast) {
				var newInteractive = this.refs.interactive.removeLast(interactive);
				this.updateInteractiveState(newInteractive);

				this.setState({
					interactiveState: newInteractive
				});
			}
		}
		terminate() {
			var { id, forChart, getInteractiveState } = this.props;
			var interactive = getInteractiveState(forChart, id, initialState);

			if (this.refs.interactive.terminate) {
				var newInteractive = this.refs.interactive.terminate(interactive);
				this.updateInteractiveState(newInteractive);

				this.setState({
					interactiveState: newInteractive
				});
			}
		}
		render() {
			/*var { id, forChart, getInteractiveState } = this.props;
			var interactive = getInteractiveState(forChart, id, initialState);

			console.log(interactive)*/
			return <InteractiveComponent
				ref="interactive"
				{...this.props}
				{...this.state}
				overrideInteractive={this.overrideInteractive} />;
			// return null;
		}
	}

	InteractiveComponentWrapper.displayName = getDisplayName(InteractiveComponent);

	InteractiveComponentWrapper.propTypes = {
		id: PropTypes.number.isRequired,
		enabled: PropTypes.bool.isRequired,
		forChart: PropTypes.number.isRequired,

		/* comes from pure converted from context to prop - START */
		getInteractiveState: PropTypes.func.isRequired,
		getCanvasContexts: PropTypes.func,
		callbackForCanvasDraw: PropTypes.func.isRequired,
		getAllCanvasDrawCallback: PropTypes.func,
		chartCanvasType: PropTypes.string.isRequired,
		setInteractiveState: PropTypes.func.isRequired,
		plotData: PropTypes.array.isRequired,
		xAccessor: PropTypes.func.isRequired,
		xScale: PropTypes.func.isRequired,
		chartConfig: PropTypes.array.isRequired,
		currentItem: PropTypes.object,
		show: PropTypes.bool.isRequired,
		displayXAccessor: PropTypes.func.isRequired,
		/* comes from pure converted from context to prop - END */
	};

	return pure(InteractiveComponentWrapper, {
		callbackForCanvasDraw: PropTypes.func.isRequired,
		getAllCanvasDrawCallback: PropTypes.func,
		chartCanvasType: PropTypes.string,


		getInteractiveState: PropTypes.func.isRequired,
		setInteractiveState: PropTypes.func.isRequired,
		plotData: PropTypes.array.isRequired,
		xAccessor: PropTypes.func.isRequired,
		xScale: PropTypes.func.isRequired,
		chartConfig: PropTypes.array.isRequired,
		mouseXY: PropTypes.array,
		currentItem: PropTypes.object,
		currentCharts: PropTypes.arrayOf(PropTypes.number),
		eventMeta: PropTypes.object,
		show: PropTypes.bool.isRequired,
		displayXAccessor: PropTypes.func.isRequired,
	});
}
export default makeInteractive;
