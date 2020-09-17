"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.defaultProps = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.helper = helper;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LabelAnnotation = function (_Component) {
	_inherits(LabelAnnotation, _Component);

	function LabelAnnotation(props) {
		_classCallCheck(this, LabelAnnotation);

		var _this = _possibleConstructorReturn(this, (LabelAnnotation.__proto__ || Object.getPrototypeOf(LabelAnnotation)).call(this, props));

		_this.handleClick = _this.handleClick.bind(_this);
		return _this;
	}

	_createClass(LabelAnnotation, [{
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
			    textAnchor = _props2.textAnchor,
			    fontFamily = _props2.fontFamily,
			    fontSize = _props2.fontSize,
			    opacity = _props2.opacity,
			    rotate = _props2.rotate;
			var _props3 = this.props,
			    xAccessor = _props3.xAccessor,
			    xScale = _props3.xScale,
			    yScale = _props3.yScale;

			var _helper = helper(this.props, xAccessor, xScale, yScale),
			    xPos = _helper.xPos,
			    yPos = _helper.yPos,
			    fill = _helper.fill,
			    text = _helper.text,
			    tooltip = _helper.tooltip;

			return _react2.default.createElement(
				"g",
				{ className: className },
				_react2.default.createElement(
					"title",
					null,
					tooltip
				),
				_react2.default.createElement(
					"text",
					{ x: xPos, y: yPos,
						fontFamily: fontFamily, fontSize: fontSize,
						fill: fill,
						opacity: opacity,
						transform: "rotate(" + rotate + ", " + xPos + ", " + yPos + ")",
						onClick: this.handleClick,
						textAnchor: textAnchor },
					text
				)
			);
		}
	}]);

	return LabelAnnotation;
}(_react.Component);

function helper(props, xAccessor, xScale, yScale) {
	var x = props.x,
	    y = props.y,
	    datum = props.datum,
	    fill = props.fill,
	    text = props.text,
	    tooltip = props.tooltip,
	    plotData = props.plotData;


	var xFunc = (0, _utils.functor)(x);
	var yFunc = (0, _utils.functor)(y);

	var _ref = [xFunc({ xScale: xScale, xAccessor: xAccessor, datum: datum, plotData: plotData }), yFunc({ yScale: yScale, datum: datum, plotData: plotData })],
	    xPos = _ref[0],
	    yPos = _ref[1];


	return {
		xPos: xPos,
		yPos: yPos,
		text: (0, _utils.functor)(text)(datum),
		fill: (0, _utils.functor)(fill)(datum),
		tooltip: (0, _utils.functor)(tooltip)(datum)
	};
}

LabelAnnotation.propTypes = {
	className: _propTypes2.default.string,
	text: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	textAnchor: _propTypes2.default.string,
	fontFamily: _propTypes2.default.string,
	fontSize: _propTypes2.default.number,
	opacity: _propTypes2.default.number,
	rotate: _propTypes2.default.number,
	onClick: _propTypes2.default.func,
	xAccessor: _propTypes2.default.func,
	xScale: _propTypes2.default.func,
	yScale: _propTypes2.default.func,
	datum: _propTypes2.default.object,
	x: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
	y: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func])
};

var defaultProps = exports.defaultProps = {
	textAnchor: "middle",
	fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fill: "#000000",
	opacity: 1,
	rotate: 0,
	x: function x(_ref2) {
		var xScale = _ref2.xScale,
		    xAccessor = _ref2.xAccessor,
		    datum = _ref2.datum;
		return xScale(xAccessor(datum));
	}
};

LabelAnnotation.defaultProps = _extends({}, defaultProps, {
	className: "react-stockcharts-labelannotation"
});

exports.default = LabelAnnotation;
//# sourceMappingURL=LabelAnnotation.js.map