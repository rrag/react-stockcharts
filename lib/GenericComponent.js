"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getAxisCanvas = getAxisCanvas;
exports.getMouseCanvas = getMouseCanvas;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var aliases = {
	mouseleave: "mousemove", // to draw interactive after mouse exit
	panend: "pan",
	pinchzoom: "pan",
	mousedown: "mousemove",
	click: "mousemove",
	contextmenu: "mousemove",
	dblclick: "mousemove",
	dragstart: "drag",
	dragend: "drag",
	dragcancel: "drag"
};

var GenericComponent = function (_Component) {
	_inherits(GenericComponent, _Component);

	function GenericComponent(props, context) {
		_classCallCheck(this, GenericComponent);

		var _this = _possibleConstructorReturn(this, (GenericComponent.__proto__ || Object.getPrototypeOf(GenericComponent)).call(this, props, context));

		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.getMoreProps = _this.getMoreProps.bind(_this);
		_this.listener = _this.listener.bind(_this);
		_this.draw = _this.draw.bind(_this);
		_this.updateMoreProps = _this.updateMoreProps.bind(_this);
		_this.evaluateType = _this.evaluateType.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		_this.preCanvasDraw = _this.preCanvasDraw.bind(_this);
		_this.postCanvasDraw = _this.postCanvasDraw.bind(_this);
		_this.getPanConditions = _this.getPanConditions.bind(_this);
		_this.shouldTypeProceed = _this.shouldTypeProceed.bind(_this);
		_this.preEvaluate = _this.preEvaluate.bind(_this);

		var generateSubscriptionId = context.generateSubscriptionId;

		_this.suscriberId = generateSubscriptionId();

		_this.moreProps = {};

		_this.state = {
			updateCount: 0
		};
		return _this;
	}

	_createClass(GenericComponent, [{
		key: "updateMoreProps",
		value: function updateMoreProps(moreProps) {
			var _this2 = this;

			Object.keys(moreProps).forEach(function (key) {
				_this2.moreProps[key] = moreProps[key];
			});
		}
	}, {
		key: "shouldTypeProceed",
		value: function shouldTypeProceed() {
			return true;
		}
	}, {
		key: "preEvaluate",
		value: function preEvaluate() {}
	}, {
		key: "listener",
		value: function listener(type, moreProps, state, e) {
			// console.log(e.shiftKey)
			if ((0, _utils.isDefined)(moreProps)) {
				this.updateMoreProps(moreProps);
			}
			this.evaluationInProgress = true;
			this.evaluateType(type, e);
			this.evaluationInProgress = false;
		}
	}, {
		key: "evaluateType",
		value: function evaluateType(type, e) {
			var newType = aliases[type] || type;
			var proceed = this.props.drawOn.indexOf(newType) > -1;

			// console.log("type ->", type, proceed);

			if (!proceed) return;
			// const moreProps = this.getMoreProps();
			this.preEvaluate(type, this.moreProps, e);
			if (!this.shouldTypeProceed(type, this.moreProps)) return;

			switch (type) {
				case "zoom":
				case "mouseenter":
					// DO NOT DRAW FOR THESE EVENTS
					break;
				case "mouseleave":
					{
						this.moreProps.hovering = false;
						var moreProps = this.getMoreProps();

						if (this.props.onUnHover) {
							this.props.onUnHover(moreProps, e);
						}
						break;
					}
				case "contextmenu":
					{
						if (this.props.onContextMenu) {
							this.props.onContextMenu(this.getMoreProps(), e);
						}
						if (this.moreProps.hovering && this.props.onContextMenuWhenHover) {
							this.props.onContextMenuWhenHover(this.getMoreProps(), e);
						}
						break;
					}
				case "mousedown":
					{
						if (this.props.onMouseDown) {
							this.props.onMouseDown(this.getMoreProps(), e);
						}
						break;
					}
				case "click":
					{
						var _moreProps = this.getMoreProps();
						if (this.moreProps.hovering) {
							// console.error("TODO use this only for SAR, Line series")
							this.props.onClickWhenHover(_moreProps, e);
						} else {
							this.props.onClickOutside(_moreProps, e);
						}
						if (this.props.onClick) {
							this.props.onClick(_moreProps, e);
						}
						break;
					}
				case "mousemove":
					{

						var prevHover = this.moreProps.hovering;
						this.moreProps.hovering = this.isHover(e);

						var _context = this.context,
						    amIOnTop = _context.amIOnTop,
						    setCursorClass = _context.setCursorClass;


						if (this.moreProps.hovering && !this.props.selected
						/* && !prevHover */
						&& amIOnTop(this.suscriberId) && (0, _utils.isDefined)(this.props.onHover)) {
							setCursorClass("react-stockcharts-pointer-cursor");
							this.iSetTheCursorClass = true;
						} else if (this.moreProps.hovering && this.props.selected && amIOnTop(this.suscriberId)) {
							setCursorClass(this.props.interactiveCursorClass);
							this.iSetTheCursorClass = true;
						} else if (prevHover && !this.moreProps.hovering && this.iSetTheCursorClass) {
							this.iSetTheCursorClass = false;
							setCursorClass(null);
						}
						var _moreProps2 = this.getMoreProps();

						if (this.moreProps.hovering && !prevHover) {
							if (this.props.onHover) {
								this.props.onHover(_moreProps2, e);
							}
						}
						if (prevHover && !this.moreProps.hovering) {
							if (this.props.onUnHover) {
								this.props.onUnHover(_moreProps2, e);
							}
						}

						if (this.props.onMouseMove) {
							this.props.onMouseMove(_moreProps2, e);
						}
						break;
					}
				case "dblclick":
					{
						var _moreProps3 = this.getMoreProps();

						if (this.props.onDoubleClick) {
							this.props.onDoubleClick(_moreProps3, e);
						}
						if (this.moreProps.hovering && this.props.onDoubleClickWhenHover) {
							this.props.onDoubleClickWhenHover(_moreProps3, e);
						}
						break;
					}
				case "pan":
					{
						this.moreProps.hovering = false;
						if (this.props.onPan) {
							this.props.onPan(this.getMoreProps(), e);
						}
						break;
					}
				case "panend":
					{
						if (this.props.onPanEnd) {
							this.props.onPanEnd(this.getMoreProps(), e);
						}
						break;
					}
				case "dragstart":
					{
						if (this.getPanConditions().draggable) {
							var _amIOnTop = this.context.amIOnTop;

							if (_amIOnTop(this.suscriberId)) {
								this.dragInProgress = true;
								this.props.onDragStart(this.getMoreProps(), e);
							}
						}
						this.someDragInProgress = true;
						break;
					}
				case "drag":
					{
						if (this.dragInProgress && this.props.onDrag) {
							this.props.onDrag(this.getMoreProps(), e);
						}
						break;
					}
				case "dragend":
					{
						if (this.dragInProgress && this.props.onDragComplete) {
							this.props.onDragComplete(this.getMoreProps(), e);
						}
						this.dragInProgress = false;
						this.someDragInProgress = false;
						break;
					}
				case "dragcancel":
					{
						if (this.dragInProgress || this.iSetTheCursorClass) {
							var _setCursorClass = this.context.setCursorClass;

							_setCursorClass(null);
						}
						break;
					}
			}
		}
	}, {
		key: "isHover",
		value: function isHover(e) {
			return (0, _utils.isDefined)(this.props.isHover) ? this.props.isHover(this.getMoreProps(), e) : false;
		}
	}, {
		key: "getPanConditions",
		value: function getPanConditions() {
			var draggable = !!(this.props.selected && this.moreProps.hovering) || this.props.enableDragOnHover && this.moreProps.hovering;

			return {
				draggable: draggable,
				panEnabled: !this.props.disablePan
			};
		}
	}, {
		key: "draw",
		value: function draw() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { force: false },
			    trigger = _ref.trigger,
			    force = _ref.force;

			var type = aliases[trigger] || trigger;
			var proceed = this.props.drawOn.indexOf(type) > -1;

			if (proceed || this.props.selected /* this is to draw as soon as you select */
			|| force) {
				var chartCanvasType = this.context.chartCanvasType;
				var canvasDraw = this.props.canvasDraw;


				if ((0, _utils.isNotDefined)(canvasDraw) || chartCanvasType === "svg") {
					var updateCount = this.state.updateCount;

					this.setState({
						updateCount: updateCount + 1
					});
				} else {
					this.drawOnCanvas();
				}
			}
		}
	}, {
		key: "componentWillMount",
		value: function componentWillMount() {
			var _context2 = this.context,
			    subscribe = _context2.subscribe,
			    chartId = _context2.chartId;
			var _props = this.props,
			    clip = _props.clip,
			    edgeClip = _props.edgeClip;


			subscribe(this.suscriberId, {
				chartId: chartId, clip: clip, edgeClip: edgeClip,
				listener: this.listener,
				draw: this.draw,
				getPanConditions: this.getPanConditions
			});
			this.componentWillReceiveProps(this.props, this.context);
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			var unsubscribe = this.context.unsubscribe;

			unsubscribe(this.suscriberId);
			if (this.iSetTheCursorClass) {
				var setCursorClass = this.context.setCursorClass;

				setCursorClass(null);
			}
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			this.componentDidUpdate(this.props);
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate(prevProps) {
			var chartCanvasType = this.context.chartCanvasType;
			var _props2 = this.props,
			    canvasDraw = _props2.canvasDraw,
			    selected = _props2.selected,
			    interactiveCursorClass = _props2.interactiveCursorClass;


			if (prevProps.selected !== selected) {
				var setCursorClass = this.context.setCursorClass;

				if (selected && this.moreProps.hovering) {
					this.iSetTheCursorClass = true;
					setCursorClass(interactiveCursorClass);
				} else {
					this.iSetTheCursorClass = false;
					setCursorClass(null);
				}
			}
			if ((0, _utils.isDefined)(canvasDraw) && !this.evaluationInProgress
			// && !(this.someDragInProgress && this.props.selected)
			/*
   prevent double draw of interactive elements
   during dragging / hover / click etc.
   */
			&& chartCanvasType !== "svg") {

				this.updateMoreProps(this.moreProps);
				this.drawOnCanvas();
			}
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps, nextContext) {
			var xScale = nextContext.xScale,
			    plotData = nextContext.plotData,
			    chartConfig = nextContext.chartConfig,
			    getMutableState = nextContext.getMutableState;


			this.props.debug(nextContext);
			this.moreProps = _extends({}, this.moreProps, getMutableState(), {
				/*
    ^ this is so
    mouseXY, currentCharts, currentItem are available to
    newly created components like MouseHoverText which
    is created right after a new interactive object is drawn
    */
				xScale: xScale, plotData: plotData, chartConfig: chartConfig
			});
		}
	}, {
		key: "getMoreProps",
		value: function getMoreProps() {
			var _context3 = this.context,
			    xScale = _context3.xScale,
			    plotData = _context3.plotData,
			    chartConfig = _context3.chartConfig,
			    morePropsDecorator = _context3.morePropsDecorator,
			    xAccessor = _context3.xAccessor,
			    displayXAccessor = _context3.displayXAccessor,
			    width = _context3.width,
			    height = _context3.height;
			var _context4 = this.context,
			    chartId = _context4.chartId,
			    fullData = _context4.fullData;


			var moreProps = _extends({
				xScale: xScale, plotData: plotData, chartConfig: chartConfig,
				xAccessor: xAccessor, displayXAccessor: displayXAccessor,
				width: width, height: height,
				chartId: chartId,
				fullData: fullData
			}, this.moreProps);

			return (morePropsDecorator || _utils.identity)(moreProps);
		}
	}, {
		key: "preCanvasDraw",
		value: function preCanvasDraw() {
			// do nothing
		}
	}, {
		key: "postCanvasDraw",
		value: function postCanvasDraw() {}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas() {
			var _props3 = this.props,
			    canvasDraw = _props3.canvasDraw,
			    canvasToDraw = _props3.canvasToDraw;
			var getCanvasContexts = this.context.getCanvasContexts;


			var moreProps = this.getMoreProps();

			var ctx = canvasToDraw(getCanvasContexts());

			this.preCanvasDraw(ctx, moreProps);
			canvasDraw(ctx, moreProps);
			this.postCanvasDraw(ctx, moreProps);
		}
	}, {
		key: "render",
		value: function render() {
			var _context5 = this.context,
			    chartCanvasType = _context5.chartCanvasType,
			    chartId = _context5.chartId;
			var _props4 = this.props,
			    canvasDraw = _props4.canvasDraw,
			    clip = _props4.clip,
			    svgDraw = _props4.svgDraw;


			if ((0, _utils.isDefined)(canvasDraw) && chartCanvasType !== "svg") {
				return null;
			}

			var suffix = (0, _utils.isDefined)(chartId) ? "-" + chartId : "";

			var style = clip ? { "clipPath": "url(#chart-area-clip" + suffix + ")" } : null;

			return _react2.default.createElement(
				"g",
				{ style: style },
				svgDraw(this.getMoreProps())
			);
		}
	}]);

	return GenericComponent;
}(_react.Component);

GenericComponent.propTypes = {
	svgDraw: _propTypes2.default.func.isRequired,
	canvasDraw: _propTypes2.default.func,

	drawOn: _propTypes2.default.array.isRequired,

	clip: _propTypes2.default.bool.isRequired,
	edgeClip: _propTypes2.default.bool.isRequired,
	interactiveCursorClass: _propTypes2.default.string,

	selected: _propTypes2.default.bool.isRequired,
	enableDragOnHover: _propTypes2.default.bool.isRequired,
	disablePan: _propTypes2.default.bool.isRequired,

	canvasToDraw: _propTypes2.default.func.isRequired,

	isHover: _propTypes2.default.func,

	onClick: _propTypes2.default.func,
	onClickWhenHover: _propTypes2.default.func,
	onClickOutside: _propTypes2.default.func,

	onPan: _propTypes2.default.func,
	onPanEnd: _propTypes2.default.func,
	onDragStart: _propTypes2.default.func,
	onDrag: _propTypes2.default.func,
	onDragComplete: _propTypes2.default.func,
	onDoubleClick: _propTypes2.default.func,
	onDoubleClickWhenHover: _propTypes2.default.func,
	onContextMenu: _propTypes2.default.func,
	onContextMenuWhenHover: _propTypes2.default.func,
	onMouseMove: _propTypes2.default.func,
	onMouseDown: _propTypes2.default.func,
	onHover: _propTypes2.default.func,
	onUnHover: _propTypes2.default.func,

	debug: _propTypes2.default.func
	// owner: PropTypes.string.isRequired,
};

GenericComponent.defaultProps = {
	svgDraw: (0, _utils.functor)(null),
	draw: [],
	canvasToDraw: function canvasToDraw(contexts) {
		return contexts.mouseCoord;
	},
	clip: true,
	edgeClip: false,
	selected: false,
	disablePan: false,
	enableDragOnHover: false,

	onClickWhenHover: _utils.noop,
	onClickOutside: _utils.noop,
	onDragStart: _utils.noop,
	onMouseMove: _utils.noop,
	onMouseDown: _utils.noop,
	debug: _utils.noop
};

GenericComponent.contextTypes = {
	width: _propTypes2.default.number.isRequired,
	height: _propTypes2.default.number.isRequired,
	margin: _propTypes2.default.object.isRequired,
	chartId: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
	getCanvasContexts: _propTypes2.default.func,

	chartCanvasType: _propTypes2.default.string,
	xScale: _propTypes2.default.func.isRequired,
	xAccessor: _propTypes2.default.func.isRequired,
	displayXAccessor: _propTypes2.default.func.isRequired,
	plotData: _propTypes2.default.array.isRequired,
	fullData: _propTypes2.default.array.isRequired,

	chartConfig: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]).isRequired,

	morePropsDecorator: _propTypes2.default.func,
	generateSubscriptionId: _propTypes2.default.func,
	getMutableState: _propTypes2.default.func.isRequired,

	amIOnTop: _propTypes2.default.func.isRequired,
	subscribe: _propTypes2.default.func.isRequired,
	unsubscribe: _propTypes2.default.func.isRequired,
	setCursorClass: _propTypes2.default.func.isRequired
};

exports.default = GenericComponent;
function getAxisCanvas(contexts) {
	return contexts.axes;
}

function getMouseCanvas(contexts) {
	return contexts.mouseCoord;
}
//# sourceMappingURL=GenericComponent.js.map