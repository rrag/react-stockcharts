"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GenericComponent2 = require("./GenericComponent");

var _GenericComponent3 = _interopRequireDefault(_GenericComponent2);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ALWAYS_TRUE_TYPES = ["drag", "dragend"];

var GenericChartComponent = function (_GenericComponent) {
	_inherits(GenericChartComponent, _GenericComponent);

	function GenericChartComponent(props, context) {
		_classCallCheck(this, GenericChartComponent);

		var _this = _possibleConstructorReturn(this, (GenericChartComponent.__proto__ || Object.getPrototypeOf(GenericChartComponent)).call(this, props, context));

		_this.preCanvasDraw = _this.preCanvasDraw.bind(_this);
		_this.postCanvasDraw = _this.postCanvasDraw.bind(_this);
		_this.shouldTypeProceed = _this.shouldTypeProceed.bind(_this);
		_this.preEvaluate = _this.preEvaluate.bind(_this);
		return _this;
	}

	_createClass(GenericChartComponent, [{
		key: "preCanvasDraw",
		value: function preCanvasDraw(ctx, moreProps) {
			_get(GenericChartComponent.prototype.__proto__ || Object.getPrototypeOf(GenericChartComponent.prototype), "preCanvasDraw", this).call(this, ctx, moreProps);
			ctx.save();
			var _context = this.context,
			    margin = _context.margin,
			    ratio = _context.ratio;
			var chartConfig = moreProps.chartConfig;


			var canvasOriginX = 0.5 * ratio + chartConfig.origin[0] + margin.left;
			var canvasOriginY = 0.5 * ratio + chartConfig.origin[1] + margin.top;

			var _moreProps$chartConfi = moreProps.chartConfig,
			    width = _moreProps$chartConfi.width,
			    height = _moreProps$chartConfi.height;
			var _props = this.props,
			    clip = _props.clip,
			    edgeClip = _props.edgeClip;


			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(ratio, ratio);
			if (edgeClip) {
				ctx.beginPath();
				ctx.rect(-1, canvasOriginY - 10, width + margin.left + margin.right + 1, height + 20);
				ctx.clip();
			}

			ctx.translate(canvasOriginX, canvasOriginY);

			if (clip) {
				ctx.beginPath();
				ctx.rect(-1, -1, width + 1, height + 1);
				ctx.clip();
			}
		}
	}, {
		key: "postCanvasDraw",
		value: function postCanvasDraw(ctx, moreProps) {
			_get(GenericChartComponent.prototype.__proto__ || Object.getPrototypeOf(GenericChartComponent.prototype), "postCanvasDraw", this).call(this, ctx, moreProps);
			ctx.restore();
		}
	}, {
		key: "updateMoreProps",
		value: function updateMoreProps(moreProps) {
			_get(GenericChartComponent.prototype.__proto__ || Object.getPrototypeOf(GenericChartComponent.prototype), "updateMoreProps", this).call(this, moreProps);
			var chartConfigList = moreProps.chartConfig;


			if (chartConfigList && Array.isArray(chartConfigList)) {
				var chartId = this.context.chartId;

				var chartConfig = (0, _utils.find)(chartConfigList, function (each) {
					return each.id === chartId;
				});
				this.moreProps.chartConfig = chartConfig;
			}
			if ((0, _utils.isDefined)(this.moreProps.chartConfig)) {
				var _moreProps$chartConfi2 = _slicedToArray(this.moreProps.chartConfig.origin, 2),
				    ox = _moreProps$chartConfi2[0],
				    oy = _moreProps$chartConfi2[1];

				if ((0, _utils.isDefined)(moreProps.mouseXY)) {
					var _moreProps$mouseXY = _slicedToArray(moreProps.mouseXY, 2),
					    x = _moreProps$mouseXY[0],
					    y = _moreProps$mouseXY[1];

					this.moreProps.mouseXY = [x - ox, y - oy];
				}
				if ((0, _utils.isDefined)(moreProps.startPos)) {
					var _moreProps$startPos = _slicedToArray(moreProps.startPos, 2),
					    _x = _moreProps$startPos[0],
					    _y = _moreProps$startPos[1];

					this.moreProps.startPos = [_x - ox, _y - oy];
				}
			}
		}
	}, {
		key: "preEvaluate",
		value: function preEvaluate() /* type, moreProps */{
			/* if (
   	type === "mousemove"
   	&& this.props.onMouseMove
   	&& isDefined(moreProps)
   	&& isDefined(moreProps.currentCharts)
   ) {
   	if (moreProps.currentCharts.indexOf(this.context.chartId) === -1) {
   		moreProps.show = false;
   	}
   } */
		}
	}, {
		key: "shouldTypeProceed",
		value: function shouldTypeProceed(type, moreProps) {
			if ((type === "mousemove" || type === "click") && this.props.disablePan) {
				return true;
			}
			if (ALWAYS_TRUE_TYPES.indexOf(type) === -1 && (0, _utils.isDefined)(moreProps) && (0, _utils.isDefined)(moreProps.currentCharts)) {
				return moreProps.currentCharts.indexOf(this.context.chartId) > -1;
			}
			return true;
		}
	}]);

	return GenericChartComponent;
}(_GenericComponent3.default);

GenericChartComponent.propTypes = _GenericComponent3.default.propTypes;

GenericChartComponent.defaultProps = _GenericComponent3.default.defaultProps;

GenericChartComponent.contextTypes = _extends({}, _GenericComponent3.default.contextTypes, {
	canvasOriginX: _propTypes2.default.number,
	canvasOriginY: _propTypes2.default.number,
	chartId: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired,
	chartConfig: _propTypes2.default.object.isRequired,
	ratio: _propTypes2.default.number.isRequired
});

exports.default = GenericChartComponent;
//# sourceMappingURL=GenericChartComponent.js.map