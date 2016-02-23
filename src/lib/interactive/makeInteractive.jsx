"use strict";

import React, { PropTypes, Component } from "react";

import pure from "../pure";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export default function makeInteractive(InteractiveComponent, subscription = [], initialState, reDrawOnPan = true) {

	class InteractiveComponentWrapper extends Component {
		constructor(props) {
			super(props);
			this.subscription = this.subscription.bind(this);
			this.updateInteractiveState = this.updateInteractiveState.bind(this);
			var { subscribe, chartId } = props;

			this.subscriptionIds = subscription.map(each => subscribe(chartId, each, this.subscription.bind(this, each)));
		}
		getInteractiveState(props) {
			var { interactiveState } = props;
			// console.log(interactiveState);
			var state = interactiveState.filter(each => each.id === props.id);
			var response = { interactive: initialState };
			if (state.length > 0) {
				response = state[0];
			}
			// console.log(interactiveState, response.interactive, this.props.id);
			return response;
		}
		updateInteractiveState(interactive) {
			var { setInteractiveState, interactiveState, id } = this.props;

			var newInteractive = interactiveState
				.map(each => each.id === id
					? { id, interactive }
					: each);

			setInteractiveState(newInteractive);
		}
		removeLast() {
			var { interactive } = this.getInteractiveState(this.props);

			if (this.refs.interactive.removeLast) {
				var newInteractive = this.refs.interactive.removeLast(interactive);
				this.updateInteractiveState(newInteractive);
			}
		}
		terminate() {
			var { interactive } = this.getInteractiveState(this.props);

			if (this.refs.interactive.terminate) {
				var newInteractive = this.refs.interactive.terminate(interactive);
				this.updateInteractiveState(newInteractive);
			}
		}
		subscription(event, arg, e) {
			var { chartId, xAccessor, displayXAccessor } = this.props;
			var { enabled } = this.props;

			var { interactive } = this.getInteractiveState(this.props);

			var interactiveState = { interactive };
			var handler = this.refs.interactive[`on${ capitalizeFirst(event) }`];
			if (enabled) {
				interactiveState = handler({ chartId, xAccessor, displayXAccessor }, interactive, arg, e);
			}
			// if (interactiveState.interactive === interactive) return false;
			return {
				id: this.props.id,
				...interactiveState,
			};
		}
		componentDidMount() {
			this.componentDidUpdate();
		}
		componentDidUpdate() {
			// console.log("Update");

			var callback = InteractiveComponent.drawOnCanvas;

			if (callback) {
				var { getCanvasContexts, chartCanvasType, plotData, chartConfig, xScale, show } = this.props;
				if (chartCanvasType !== "svg") {

					var { defaultProps } = InteractiveComponent;
					var props = { ...defaultProps, ...this.props };
					var contexts = getCanvasContexts();
					var { interactive } = this.getInteractiveState(this.props);

					// console.log(interactive);
					if (contexts) {
						InteractiveComponentWrapper.drawOnCanvas(callback,
							props, interactive,
							contexts.interactive, { show, xScale, plotData, chartConfig });
					}
				}
			}
		}
		componentWillMount() {
			this.componentWillReceiveProps(this.props, this.context);
		}
		componentWillReceiveProps(nextProps) {
			// var nextContext = this.context;
			// var nextProps = this.props;

			// console.log("HERE", nextProps.interactiveState);
			var { chartId, getAllCanvasDrawCallback, callbackForCanvasDraw } = nextProps;
			var callback = InteractiveComponent.drawOnCanvas;

			if (reDrawOnPan && callback) {
				// var { defaultProps } = ;
				var props = { ...InteractiveComponent.defaultProps, ...nextProps };

				var draw = InteractiveComponentWrapper.drawOnCanvas.bind(null, callback,
					props, this.getInteractiveState(nextProps).interactive);

				var temp = getAllCanvasDrawCallback()
					.filter(each => each.type === "interactive")
					.filter(each => each.id === nextProps.id)
					.filter(each => each.chartId === chartId)
					;
				if (temp.length === 0) {
					callbackForCanvasDraw({
						type: "interactive",
						chartId: chartId,
						id: nextProps.id,
						draw: draw,
					});
				} else {
					callbackForCanvasDraw(temp[0], {
						type: "interactive",
						chartId: chartId,
						id: nextProps.id,
						draw: draw,
					});
				}
			}
		}
		componentWillUnmount() {
			var { unsubscribe } = this.props;
			this.subscriptionIds.forEach((each) => {
				unsubscribe(each);
			});
		}
		render() {
			var { interactive } = this.getInteractiveState(this.props);

			return <InteractiveComponent ref="interactive" {...this.props} interactive={interactive} />;
		}
	}

	InteractiveComponentWrapper.displayName = getDisplayName(InteractiveComponent);

	InteractiveComponentWrapper.drawOnCanvas = (callback, props, interactiveState, ctx, chartContext) => {
		// console.log( props, interactiveState);
		var { canvasOriginX, canvasOriginY, width, height } = props;

		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOriginX, canvasOriginY);

		ctx.beginPath();
		ctx.rect(-1, -1, width + 1, height + 1);
		ctx.clip();

		if (callback) {
			callback(props, interactiveState, ctx, chartContext);
		}

		ctx.restore();
	};

	InteractiveComponentWrapper.propTypes = {
		id: PropTypes.number.isRequired,
		enabled: PropTypes.bool.isRequired,

		/* comes from pure converted from context to prop - START */
		chartId: PropTypes.number.isRequired,
		interactiveState: PropTypes.array.isRequired,
		getCanvasContexts: PropTypes.func,
		callbackForCanvasDraw: PropTypes.func.isRequired,
		getAllCanvasDrawCallback: PropTypes.func,
		chartCanvasType: PropTypes.string.isRequired,
		subscribe: PropTypes.func.isRequired,
		setInteractiveState: PropTypes.func.isRequired,
		unsubscribe: PropTypes.func.isRequired,
		plotData: PropTypes.array.isRequired,
		xAccessor: PropTypes.func.isRequired,
		xScale: PropTypes.func.isRequired,
		chartConfig: PropTypes.object.isRequired,
		currentItem: PropTypes.object.isRequired,
		canvasOriginX: PropTypes.number,
		canvasOriginY: PropTypes.number,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		show: PropTypes.bool.isRequired,
		displayXAccessor: PropTypes.func.isRequired,
		/* comes from pure converted from context to prop - END */
	};

	return pure(InteractiveComponentWrapper, {
		chartId: PropTypes.number.isRequired,
		interactiveState: PropTypes.array.isRequired,
		getCanvasContexts: PropTypes.func,
		callbackForCanvasDraw: PropTypes.func.isRequired,
		getAllCanvasDrawCallback: PropTypes.func,
		chartCanvasType: PropTypes.string.isRequired,
		subscribe: PropTypes.func.isRequired,
		setInteractiveState: PropTypes.func.isRequired,
		unsubscribe: PropTypes.func.isRequired,
		plotData: PropTypes.array.isRequired,
		xAccessor: PropTypes.func.isRequired,
		xScale: PropTypes.func.isRequired,
		chartConfig: PropTypes.object.isRequired,
		currentItem: PropTypes.object.isRequired,
		canvasOriginX: PropTypes.number,
		canvasOriginY: PropTypes.number,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		show: PropTypes.bool.isRequired,
		displayXAccessor: PropTypes.func.isRequired,
	});
}

export default makeInteractive;
