"use strict";

import React from "react";
import objectAssign from "object-assign";

function getDisplayName(Series) {
	var name = Series.displayName || Series.name || "Series";
	return name;
}

function capitalizeFirst(str) {
	return str.charAt(0).toUpperCase() + str.substring(1);
}

export default function makeInteractive(InteractiveComponent, subscription = [], initialState, reDrawOnPan = true) {
	class InteractiveComponentWrapper extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				interactive: initialState,
			};
			this.subscriptionIds = [];
			this.subscription = this.subscription.bind(this);
		}
		subscription(event, arg, e) {
			var { chartId, xAccessor } = this.context;

			var handler = this.refs.interactive[`on${ capitalizeFirst(event) }`];

			var { interactive } = this.state;
			var interactiveState = handler(chartId, xAccessor, interactive, arg, e);

			// console.log(interactiveState);
			this.setState({
				interactive: interactiveState,
			}, () => {
				var callback = InteractiveComponent.drawOnCanvas;

				if (reDrawOnPan && callback) {

					var { defaultProps } = InteractiveComponent;
					var props = objectAssign({}, defaultProps, this.props);

					var { interactive } = this.state;

					// console.log(event, interactive);

					var draw = InteractiveComponentWrapper.drawOnCanvas.bind(null, callback, this.context, props, interactive);

					var temp = this.context.getAllCanvasDrawCallback().filter(each => each.type === "interactive");
					if (temp.length > 0) {
						this.context.callbackForCanvasDraw(temp[0], {
							type: "interactive",
							chartId: chartId,
							draw: draw,
						});
					}
				}
			});
		}
		componentDidMount() {
			var { subscribe, chartId, xAccessor } = this.context;
			this.subscriptionIds = subscription.map(each => subscribe(chartId, each, this.subscription.bind(this, each)));
			this.componentDidUpdate();
		}
		componentDidUpdate() {
			var callback = InteractiveComponent.drawOnCanvas;

			if (callback) {
				var { getCanvasContexts, chartCanvasType, plotData, chartData } = this.context;
				if (chartCanvasType !== "svg") {

					var contexts = getCanvasContexts();
					var { defaultProps } = InteractiveComponent;
					var props = objectAssign({}, defaultProps, this.props);

					if (contexts) {
						InteractiveComponentWrapper.drawOnCanvas(callback,
							this.context, props, this.state.interactive,
							contexts.interactive, { plotData, chartData });
					}
				}
			}
		}
		componentWillMount() {
			this.componentWillReceiveProps(this.props, this.context);
		}
		componentWillReceiveProps(nextProps, nextContext) {
			var { chartId } = nextContext;
			var callback = InteractiveComponent.drawOnCanvas;

			if (reDrawOnPan && callback) {
				var { defaultProps } = InteractiveComponent;
				var props = objectAssign({}, defaultProps, nextProps);

				var draw = InteractiveComponentWrapper.drawOnCanvas.bind(null, callback, nextContext, props, this.state.interactive);

				nextContext.callbackForCanvasDraw({
					type: "interactive",
					chartId: chartId,
					draw: draw,
				});
			}
		}
		componentWillUnmount() {
			var { unsubscribe } = this.context;
			this.subscriptionIds.forEach((each) => {
				unsubscribe(each);
			})
		}
		render() {
			return <InteractiveComponent ref="interactive" {...this.props} />;
		}
	}

	InteractiveComponentWrapper.displayName = getDisplayName(InteractiveComponent);

	InteractiveComponentWrapper.drawOnCanvas = (callback, context, props, interactiveState, ctx, chartContext) => {
		// console.log(context, props, interactiveState);
		var { canvasOriginX, canvasOriginY, width, height } = context;
		ctx.save();

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.translate(canvasOriginX, canvasOriginY);

		ctx.rect(-1, -1, width + 1, height + 1);
		ctx.clip();

		callback(context, props, interactiveState, ctx, chartContext);

		ctx.restore();
	};

	InteractiveComponentWrapper.contextTypes = {
		chartId: React.PropTypes.number.isRequired,
		getCanvasContexts: React.PropTypes.func,
		callbackForCanvasDraw: React.PropTypes.func.isRequired,
		getAllCanvasDrawCallback: React.PropTypes.func,
		chartCanvasType: React.PropTypes.string.isRequired,
		subscribe: React.PropTypes.func.isRequired,
		unsubscribe: React.PropTypes.func.isRequired,
		plotData: React.PropTypes.array.isRequired,
		xAccessor: React.PropTypes.func.isRequired,
		chartData: React.PropTypes.object.isRequired,
		canvasOriginX: React.PropTypes.number,
		canvasOriginY: React.PropTypes.number,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
	};

	return InteractiveComponentWrapper;
}

export default makeInteractive;
