"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Scale = require("d3-scale");

var _PureComponent2 = require("./utils/PureComponent");

var _PureComponent3 = _interopRequireDefault(_PureComponent2);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart = function (_PureComponent) {
	_inherits(Chart, _PureComponent);

	function Chart(props, context) {
		_classCallCheck(this, Chart);

		var _this = _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, props, context));

		_this.yScale = _this.yScale.bind(_this);
		_this.listener = _this.listener.bind(_this);
		return _this;
	}

	_createClass(Chart, [{
		key: "componentWillMount",
		value: function componentWillMount() {
			var id = this.props.id;
			var subscribe = this.context.subscribe;

			subscribe("chart_" + id, {
				listener: this.listener
			});
		}
	}, {
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			var id = this.props.id;
			var unsubscribe = this.context.unsubscribe;

			unsubscribe("chart_" + id);
		}
	}, {
		key: "listener",
		value: function listener(type, moreProps, state, e) {
			var _props = this.props,
			    id = _props.id,
			    onContextMenu = _props.onContextMenu;


			if (type === "contextmenu") {
				var currentCharts = moreProps.currentCharts;

				if (currentCharts.indexOf(id) > -1) {
					onContextMenu(moreProps, e);
				}
			}
		}
	}, {
		key: "yScale",
		value: function yScale() {
			var _this2 = this;

			var chartConfig = (0, _utils.find)(this.context.chartConfig, function (each) {
				return each.id === _this2.props.id;
			});
			return chartConfig.yScale.copy();
		}
	}, {
		key: "getChildContext",
		value: function getChildContext() {
			var chartId = this.props.id;

			var chartConfig = (0, _utils.find)(this.context.chartConfig, function (each) {
				return each.id === chartId;
			});

			return {
				chartId: chartId,
				chartConfig: chartConfig
			};
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var _find = (0, _utils.find)(this.context.chartConfig, function (each) {
				return each.id === _this3.props.id;
			}),
			    origin = _find.origin;

			var _origin = _slicedToArray(origin, 2),
			    x = _origin[0],
			    y = _origin[1];

			return _react2.default.createElement(
				"g",
				{ transform: "translate(" + x + ", " + y + ")" },
				this.props.children
			);
		}
	}]);

	return Chart;
}(_PureComponent3.default);

Chart.propTypes = {
	height: _propTypes2.default.number,
	origin: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.func]),
	id: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired,
	yExtents: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.func]),
	yExtentsCalculator: function yExtentsCalculator(props, propName, componentName) {
		if ((0, _utils.isNotDefined)(props.yExtents) && typeof props.yExtentsCalculator !== "function") return new Error("yExtents or yExtentsCalculator must" + (" be present on " + componentName + ". Validation failed."));
	},
	onContextMenu: _propTypes2.default.func,
	yScale: _propTypes2.default.func,

	flipYScale: _propTypes2.default.bool,
	padding: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.shape({
		top: _propTypes2.default.number,
		bottom: _propTypes2.default.number
	})]),
	children: _propTypes2.default.node
};

Chart.defaultProps = {
	id: 0,
	origin: [0, 0],
	padding: 0,
	yScale: (0, _d3Scale.scaleLinear)(),
	flipYScale: false,
	yPan: true,
	yPanEnabled: false,
	onContextMenu: _utils.noop
};

Chart.contextTypes = {
	chartConfig: _propTypes2.default.array,
	subscribe: _propTypes2.default.func.isRequired,
	unsubscribe: _propTypes2.default.func.isRequired
};

Chart.childContextTypes = {
	chartConfig: _propTypes2.default.object.isRequired,
	chartId: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired
};

exports.default = Chart;
//# sourceMappingURL=Chart.js.map