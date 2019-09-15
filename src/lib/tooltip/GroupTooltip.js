"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Format = require("d3-format");

var _displayValuesFor = require("./displayValuesFor");

var _displayValuesFor2 = _interopRequireDefault(_displayValuesFor);

var _GenericChartComponent = require("../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _ToolTipText = require("./ToolTipText");

var _ToolTipText2 = _interopRequireDefault(_ToolTipText);

var _ToolTipTSpanLabel = require("./ToolTipTSpanLabel");

var _ToolTipTSpanLabel2 = _interopRequireDefault(_ToolTipTSpanLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VALID_LAYOUTS = ["horizontal", "horizontalRows", "horizontalInline", "vertical", "verticalRows"];

var SingleTooltip = function (_Component) {
	_inherits(SingleTooltip, _Component);

	function SingleTooltip(props) {
		_classCallCheck(this, SingleTooltip);

		var _this = _possibleConstructorReturn(this, (SingleTooltip.__proto__ || Object.getPrototypeOf(SingleTooltip)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(SingleTooltip, [{
		key: "handleClick",
		value: function handleClick(e) {
			var _props = this.props,
			    onClick = _props.onClick,
			    forChart = _props.forChart,
			    options = _props.options;

			onClick(_extends({ chartId: forChart }, options), e);
		}

		/**
   * Renders the value next to the label.
   */

	}, {
		key: "renderValueNextToLabel",
		value: function renderValueNextToLabel() {
			var _props2 = this.props,
			    origin = _props2.origin,
			    yLabel = _props2.yLabel,
			    yValue = _props2.yValue,
			    labelFill = _props2.labelFill,
			    valueFill = _props2.valueFill,
			    withShape = _props2.withShape,
			    fontSize = _props2.fontSize,
			    fontFamily = _props2.fontFamily;


			return _react2.default.createElement(
				"g",
				{ transform: "translate(" + origin[0] + ", " + origin[1] + ")", onClick: this.handleClick },
				withShape ? _react2.default.createElement("rect", { x: "0", y: "-6", width: "6", height: "6", fill: valueFill }) : null,
				_react2.default.createElement(
					_ToolTipText2.default,
					{ x: withShape ? 8 : 0, y: 0, fontFamily: fontFamily, fontSize: fontSize },
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						yLabel,
						": "
					),
					_react2.default.createElement(
						"tspan",
						{ fill: valueFill },
						yValue
					)
				)
			);
		}

		/**
   * Renders the value beneath the label.
   */

	}, {
		key: "renderValueBeneathToLabel",
		value: function renderValueBeneathToLabel() {
			var _props3 = this.props,
			    origin = _props3.origin,
			    yLabel = _props3.yLabel,
			    yValue = _props3.yValue,
			    labelFill = _props3.labelFill,
			    valueFill = _props3.valueFill,
			    withShape = _props3.withShape,
			    fontSize = _props3.fontSize,
			    fontFamily = _props3.fontFamily;


			return _react2.default.createElement(
				"g",
				{ transform: "translate(" + origin[0] + ", " + origin[1] + ")", onClick: this.handleClick },
				withShape ? _react2.default.createElement("line", { x1: 0, y1: 2, x2: 0, y2: 28, stroke: valueFill, strokeWidth: "4px" }) : null,
				_react2.default.createElement(
					_ToolTipText2.default,
					{ x: 5, y: 11, fontFamily: fontFamily, fontSize: fontSize },
					_react2.default.createElement(
						_ToolTipTSpanLabel2.default,
						{ fill: labelFill },
						yLabel
					),
					_react2.default.createElement(
						"tspan",
						{ x: "5", dy: "15", fill: valueFill },
						yValue
					)
				)
			);
		}

		/**
   * Renders the value next to the label.
   * The parent component must have a "text"-element.
   */

	}, {
		key: "renderInline",
		value: function renderInline() {
			var _props4 = this.props,
			    yLabel = _props4.yLabel,
			    yValue = _props4.yValue,
			    labelFill = _props4.labelFill,
			    valueFill = _props4.valueFill,
			    fontSize = _props4.fontSize,
			    fontFamily = _props4.fontFamily;


			return _react2.default.createElement(
				"tspan",
				{ onClick: this.handleClick, fontFamily: fontFamily, fontSize: fontSize },
				_react2.default.createElement(
					_ToolTipTSpanLabel2.default,
					{ fill: labelFill },
					yLabel,
					":\xA0"
				),
				_react2.default.createElement(
					"tspan",
					{ fill: valueFill },
					yValue,
					"\xA0\xA0"
				)
			);
		}
	}, {
		key: "render",
		value: function render() {
			var layout = this.props.layout;

			var comp = null;

			switch (layout) {
				case "horizontal":
					comp = this.renderValueNextToLabel();
					break;
				case "horizontalRows":
					comp = this.renderValueBeneathToLabel();
					break;
				case "horizontalInline":
					comp = this.renderInline();
					break;
				case "vertical":
					comp = this.renderValueNextToLabel();
					break;
				case "verticalRows":
					comp = this.renderValueBeneathToLabel();
					break;
				default:
					comp = this.renderValueNextToLabel();
			}

			return comp;
		}
	}]);

	return SingleTooltip;
}(_react.Component);

SingleTooltip.propTypes = {
	origin: _propTypes2.default.array.isRequired,
	yLabel: _propTypes2.default.string.isRequired,
	yValue: _propTypes2.default.string.isRequired,
	onClick: _propTypes2.default.func,
	fontFamily: _propTypes2.default.string,
	labelFill: _propTypes2.default.string.isRequired,
	valueFill: _propTypes2.default.string.isRequired,
	fontSize: _propTypes2.default.number,
	withShape: _propTypes2.default.bool,
	forChart: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired,
	options: _propTypes2.default.object.isRequired,
	layout: _propTypes2.default.oneOf(VALID_LAYOUTS).isRequired
};

SingleTooltip.defaultProps = {
	labelFill: "#4682B4",
	valueFill: "#000000",
	withShape: false
};

var GroupTooltip = function (_Component2) {
	_inherits(GroupTooltip, _Component2);

	function GroupTooltip(props) {
		_classCallCheck(this, GroupTooltip);

		var _this2 = _possibleConstructorReturn(this, (GroupTooltip.__proto__ || Object.getPrototypeOf(GroupTooltip)).call(this, props));

		_this2.renderSVG = _this2.renderSVG.bind(_this2);
		return _this2;
	}

	_createClass(GroupTooltip, [{
		key: "getPosition",
		value: function getPosition(moreProps) {
			var position = this.props.position;
			var _moreProps$chartConfi = moreProps.chartConfig,
			    height = _moreProps$chartConfi.height,
			    width = _moreProps$chartConfi.width;


			var dx = 20;
			var dy = 40;
			var textAnchor = null;
			var xyPos = null;

			if (position !== undefined) {
				switch (position) {
					case "topRight":
						xyPos = [width - dx, null];
						textAnchor = "end";
						break;
					case "bottomLeft":
						xyPos = [null, height - dy];
						break;
					case "bottomRight":
						xyPos = [width - dx, height - dy];
						textAnchor = "end";
						break;
					default:
						xyPos = [null, null];
				}
			} else {
				xyPos = [null, null];
			}

			return { xyPos: xyPos, textAnchor: textAnchor };
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var displayValuesFor = this.props.displayValuesFor;
			var chartId = moreProps.chartId;
			var _props5 = this.props,
			    className = _props5.className,
			    onClick = _props5.onClick,
			    width = _props5.width,
			    verticalSize = _props5.verticalSize,
			    fontFamily = _props5.fontFamily,
			    fontSize = _props5.fontSize,
			    layout = _props5.layout;
			var _props6 = this.props,
			    origin = _props6.origin,
			    displayFormat = _props6.displayFormat,
			    options = _props6.options;

			var currentItem = displayValuesFor(this.props, moreProps);

			var _getPosition = this.getPosition(moreProps),
			    xyPos = _getPosition.xyPos,
			    textAnchor = _getPosition.textAnchor;

			var xPos = xyPos != null && xyPos[0] != null ? xyPos[0] : origin[0];
			var yPos = xyPos != null && xyPos[1] != null ? xyPos[1] : origin[1];

			var singleTooltip = options.map(function (each, idx) {

				var yValue = currentItem && each.yAccessor(currentItem);
				var yDisplayValue = yValue ? displayFormat(yValue) : "n/a";

				var orig = function orig() {
					if (layout === "horizontal" || layout === "horizontalRows") {
						return [width * idx, 0];
					}
					if (layout === "vertical") {
						return [0, verticalSize * idx];
					}
					if (layout === "verticalRows") {
						return [0, verticalSize * 2.3 * idx];
					}
					return [0, 0];
				};

				return _react2.default.createElement(SingleTooltip, {
					key: idx,
					layout: layout,
					origin: orig(),
					yLabel: each.yLabel,
					yValue: yDisplayValue,
					options: each,
					forChart: chartId,
					onClick: onClick,
					fontFamily: fontFamily,
					fontSize: fontSize,
					labelFill: each.labelFill,
					valueFill: each.valueFill,
					withShape: each.withShape
				});
			});

			return _react2.default.createElement(
				"g",
				{ transform: "translate(" + xPos + ", " + yPos + ")", className: className, textAnchor: textAnchor },
				layout === "horizontalInline" ? _react2.default.createElement(
					_ToolTipText2.default,
					{ x: 0, y: 0, fontFamily: fontFamily, fontSize: fontSize },
					singleTooltip
				) : singleTooltip
			);
		}
	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(_GenericChartComponent2.default, {
				clip: false,
				svgDraw: this.renderSVG,
				drawOn: ["mousemove"]
			});
		}
	}]);

	return GroupTooltip;
}(_react.Component);

GroupTooltip.propTypes = {
	className: _propTypes2.default.string,
	layout: _propTypes2.default.oneOf(VALID_LAYOUTS).isRequired,
	position: _propTypes2.default.oneOf(["topRight", "bottomLeft", "bottomRight"]),
	displayFormat: _propTypes2.default.func.isRequired,
	origin: _propTypes2.default.array.isRequired,
	displayValuesFor: _propTypes2.default.func,
	onClick: _propTypes2.default.func,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	width: _propTypes2.default.number, // "width" only be used, if layout is "horizontal" or "horizontalRows".
	verticalSize: _propTypes2.default.number, // "verticalSize" only be used, if layout is "vertical", "verticalRows".
	options: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		yLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired,
		yAccessor: _propTypes2.default.func.isRequired,
		labelFill: _propTypes2.default.string,
		valueFill: _propTypes2.default.string,
		withShape: _propTypes2.default.bool // "withShape" is ignored, if layout is "horizontalInline" or "vertical".
	}))
};

GroupTooltip.defaultProps = {
	className: "react-stockcharts-tooltip react-stockcharts-group-tooltip",
	layout: "horizontal",
	displayFormat: (0, _d3Format.format)(".2f"),
	displayValuesFor: _displayValuesFor2.default,
	origin: [0, 0],
	width: 60,
	verticalSize: 13
};

exports.default = GroupTooltip;
//# sourceMappingURL=GroupTooltip.js.map