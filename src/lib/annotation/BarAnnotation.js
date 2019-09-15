"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getArrowForTextIcon = getArrowForTextIcon;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BarAnnotation = function (_Component) {
	_inherits(BarAnnotation, _Component);

	function BarAnnotation(props) {
		_classCallCheck(this, BarAnnotation);

		var _this = _possibleConstructorReturn(this, (BarAnnotation.__proto__ || Object.getPrototypeOf(BarAnnotation)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(BarAnnotation, [{
		key: "handleClick",
		value: function handleClick(e) {
			var onClick = this.props.onClick;


			if (onClick) {
				var _props = this.props,
				    xScale = _props.xScale,
				    yScale = _props.yScale,
				    datum = _props.datum;

				onClick({ xScale: xScale, yScale: yScale, datum: datum }, e);
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _props2 = this.props,
			    className = _props2.className,
			    stroke = _props2.stroke,
			    opacity = _props2.opacity;
			var _props3 = this.props,
			    xAccessor = _props3.xAccessor,
			    xScale = _props3.xScale,
			    yScale = _props3.yScale,
			    path = _props3.path;
			var _props4 = this.props,
			    text = _props4.text,
			    textXOffset = _props4.textXOffset,
			    textYOffset = _props4.textYOffset,
			    textAnchor = _props4.textAnchor,
			    fontFamily = _props4.fontFamily,
			    fontSize = _props4.fontSize,
			    textFill = _props4.textFill,
			    textOpacity = _props4.textOpacity,
			    textRotate = _props4.textRotate;

			var _helper = helper(this.props, xAccessor, xScale, yScale),
			    x = _helper.x,
			    y = _helper.y,
			    fill = _helper.fill,
			    tooltip = _helper.tooltip;

			var _props5 = this.props,
			    textIcon = _props5.textIcon,
			    textIconFontSize = _props5.textIconFontSize,
			    textIconFill = _props5.textIconFill,
			    textIconOpacity = _props5.textIconOpacity,
			    textIconRotate = _props5.textIconRotate,
			    textIconXOffset = _props5.textIconXOffset,
			    textIconYOffset = _props5.textIconYOffset;


			return _react2.default.createElement(
				"g",
				{ className: className, onClick: this.handleClick },
				tooltip != null ? _react2.default.createElement(
					"title",
					null,
					tooltip
				) : null,
				text != null ? _react2.default.createElement(
					"text",
					{
						x: x,
						y: y,
						dx: textXOffset,
						dy: textYOffset,
						fontFamily: fontFamily,
						fontSize: fontSize,
						fill: textFill,
						opacity: textOpacity,
						transform: textRotate != null ? "rotate(" + textRotate + ", " + x + ", " + y + ")" : null,
						textAnchor: textAnchor
					},
					text
				) : null,
				textIcon != null ? _react2.default.createElement(
					"text",
					{
						x: x,
						y: y,
						dx: textIconXOffset,
						dy: textIconYOffset,
						fontSize: textIconFontSize,
						fill: textIconFill,
						opacity: textIconOpacity,
						transform: textIconRotate != null ? "rotate(" + textIconRotate + ", " + x + ", " + y + ")" : null,
						textAnchor: textAnchor
					},
					textIcon
				) : null,
				path != null ? _react2.default.createElement("path", {
					d: path({ x: x, y: y }),
					stroke: stroke,
					fill: fill,
					opacity: opacity
				}) : null
			);
		}
	}]);

	return BarAnnotation;
}(_react.Component);

function helper(props, xAccessor, xScale, yScale) {
	var x = props.x,
	    y = props.y,
	    datum = props.datum,
	    fill = props.fill,
	    tooltip = props.tooltip,
	    plotData = props.plotData;


	var xFunc = (0, _utils.functor)(x);
	var yFunc = (0, _utils.functor)(y);

	var _ref = [xFunc({ xScale: xScale, xAccessor: xAccessor, datum: datum, plotData: plotData }), yFunc({ yScale: yScale, datum: datum, plotData: plotData })],
	    xPos = _ref[0],
	    yPos = _ref[1];


	return {
		x: xPos,
		y: yPos,
		fill: (0, _utils.functor)(fill)(datum),
		tooltip: (0, _utils.functor)(tooltip)(datum)
	};
}

/**
 * any unicode can be applied.
 * @param {any} type
 */

function getArrowForTextIcon(type) {
	var arrows = {
		simpleUp: "⬆",
		simpleDown: "⬇",
		fatUp: "▲",
		fatDown: "▼",
		lightUp: "↑",
		lightDown: "↓",
		dashedUp: "⇡",
		dashedDown: "⇣",
		dashedRight: "➟",
		fatRight: "➡",
		right: "➤"
	};
	return arrows[type];
}

BarAnnotation.propTypes = {
	className: _propTypes2.default.string,
	path: _propTypes2.default.func,
	onClick: _propTypes2.default.func,
	xAccessor: _propTypes2.default.func,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func,
	datum: _propTypes2.default.object,
	stroke: _propTypes2.default.string,
	fill: _propTypes2.default.string,
	opacity: _propTypes2.default.number,
	text: _propTypes2.default.string,
	textAnchor: _propTypes2.default.string,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	textOpacity: _propTypes2.default.number,
	textFill: _propTypes2.default.string,
	textRotate: _propTypes2.default.number,
	textXOffset: _propTypes2.default.number,
	textYOffset: _propTypes2.default.number,
	textIcon: _propTypes2.default.string,
	textIconFontSize: _propTypes2.default.number,
	textIconOpacity: _propTypes2.default.number,
	textIconFill: _propTypes2.default.string,
	textIconRotate: _propTypes2.default.number,
	textIconXOffset: _propTypes2.default.number,
	textIconYOffset: _propTypes2.default.number,
	textIconAnchor: _propTypes2.default.string
};

BarAnnotation.defaultProps = {
	className: "react-stockcharts-bar-annotation",
	opacity: 1,
	fill: "#000000",
	textAnchor: "middle",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 10,
	textFill: "#000000",
	textOpacity: 1,
	textIconFill: "#000000",
	textIconFontSize: 10,
	x: function x(_ref2) {
		var xScale = _ref2.xScale,
		    xAccessor = _ref2.xAccessor,
		    datum = _ref2.datum;
		return xScale(xAccessor(datum));
	}
};

exports.default = BarAnnotation;
//# sourceMappingURL=BarAnnotation.js.map