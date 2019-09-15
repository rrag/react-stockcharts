"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ToolTipTSpanLabel(props) {
	return _react2.default.createElement(
		"tspan",
		_extends({ className: "react-stockcharts-tooltip-label" }, props),
		props.children
	);
}

ToolTipTSpanLabel.propTypes = {
	children: _propTypes2.default.node.isRequired,
	fill: _propTypes2.default.string.isRequired
};

ToolTipTSpanLabel.defaultProps = {
	fill: "#4682B4"
};

exports.default = ToolTipTSpanLabel;
//# sourceMappingURL=ToolTipTSpanLabel.js.map