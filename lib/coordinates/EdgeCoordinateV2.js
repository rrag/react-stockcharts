"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.renderSVG = renderSVG;
exports.drawOnCanvas = drawOnCanvas;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/prop-types */
function renderSVG(props) {
	var className = props.className;


	var edge = helper(props);
	if (edge === null) return null;
	var line = void 0,
	    coordinateBase = void 0,
	    coordinate = void 0;

	if ((0, _utils.isDefined)(edge.line)) {
		line = _react2.default.createElement("line", {
			className: "react-stockcharts-cross-hair", opacity: edge.line.opacity, stroke: edge.line.stroke,
			x1: edge.line.x1, y1: edge.line.y1,
			x2: edge.line.x2, y2: edge.line.y2 });
	}
	if ((0, _utils.isDefined)(edge.coordinateBase)) {
		var _edge$coordinateBase = edge.coordinateBase,
		    rectWidth = _edge$coordinateBase.rectWidth,
		    rectHeight = _edge$coordinateBase.rectHeight,
		    arrowWidth = _edge$coordinateBase.arrowWidth;


		var path = edge.orient === "left" ? "M0,0L0," + rectHeight + "L" + rectWidth + "," + rectHeight + "L" + (rectWidth + arrowWidth) + ",10L" + rectWidth + ",0L0,0L0,0" : "M0," + arrowWidth + "L" + arrowWidth + "," + rectHeight + "L" + (rectWidth + arrowWidth) + "," + rectHeight + "L" + (rectWidth + arrowWidth) + ",0L" + arrowWidth + ",0L0," + arrowWidth;

		coordinateBase = edge.orient === "left" || edge.orient === "right" ? _react2.default.createElement(
			"g",
			{ transform: "translate(" + edge.coordinateBase.edgeXRect + "," + edge.coordinateBase.edgeYRect + ")" },
			_react2.default.createElement("path", { d: path, key: 1, className: "react-stockchart-text-background",
				height: rectHeight, width: rectWidth,
				fill: edge.coordinateBase.fill, opacity: edge.coordinateBase.opacity })
		) : _react2.default.createElement("rect", { key: 1, className: "react-stockchart-text-background",
			x: edge.coordinateBase.edgeXRect,
			y: edge.coordinateBase.edgeYRect,
			height: rectHeight, width: rectWidth,
			fill: edge.coordinateBase.fill, opacity: edge.coordinateBase.opacity });

		coordinate = _react2.default.createElement(
			"text",
			{ key: 2, x: edge.coordinate.edgeXText,
				y: edge.coordinate.edgeYText,
				textAnchor: edge.coordinate.textAnchor,
				fontFamily: edge.coordinate.fontFamily,
				fontSize: edge.coordinate.fontSize,
				dy: ".32em", fill: edge.coordinate.textFill },
			edge.coordinate.displayCoordinate
		);
	}
	return _react2.default.createElement(
		"g",
		{ className: className },
		line,
		coordinateBase,
		coordinate
	);
}
/* eslint-enable react/prop-types */

function helper(props) {
	var displayCoordinate = props.coordinate,
	    show = props.show,
	    type = props.type,
	    orient = props.orient,
	    edgeAt = props.edgeAt,
	    hideLine = props.hideLine;
	var fill = props.fill,
	    opacity = props.opacity,
	    fontFamily = props.fontFamily,
	    fontSize = props.fontSize,
	    textFill = props.textFill,
	    lineStroke = props.lineStroke,
	    lineOpacity = props.lineOpacity,
	    arrowWidth = props.arrowWidth;
	var rectWidth = props.rectWidth,
	    rectHeight = props.rectHeight;
	var x1 = props.x1,
	    y1 = props.y1,
	    x2 = props.x2,
	    y2 = props.y2,
	    dx = props.dx;


	if (!show) return null;

	// rectWidth = rectWidth ? rectWidth : (type === "horizontal") ? 60 : 100;

	var edgeXRect = void 0,
	    edgeYRect = void 0,
	    edgeXText = void 0,
	    edgeYText = void 0;

	if (type === "horizontal") {

		edgeXRect = dx + (orient === "right" ? edgeAt + 1 : edgeAt - rectWidth - arrowWidth - 1);
		edgeYRect = y1 - rectHeight / 2;
		edgeXText = dx + (orient === "right" ? edgeAt + rectWidth / 2 + arrowWidth : edgeAt - rectWidth / 2 - arrowWidth);
		edgeYText = y1;
	} else {
		edgeXRect = x1 - rectWidth / 2;
		edgeYRect = orient === "bottom" ? edgeAt : edgeAt - rectHeight;
		edgeXText = x1;
		edgeYText = orient === "bottom" ? edgeAt + rectHeight / 2 : edgeAt - rectHeight / 2;
	}
	var coordinateBase = void 0,
	    coordinate = void 0;
	var textAnchor = "middle";
	if ((0, _utils.isDefined)(displayCoordinate)) {
		coordinateBase = {
			edgeXRect: edgeXRect, edgeYRect: edgeYRect, rectHeight: rectHeight, rectWidth: rectWidth, fill: fill, opacity: opacity, arrowWidth: arrowWidth
		};
		coordinate = {
			edgeXText: edgeXText, edgeYText: edgeYText, textAnchor: textAnchor, fontFamily: fontFamily, fontSize: fontSize, textFill: textFill, displayCoordinate: displayCoordinate
		};
	}

	var line = hideLine ? undefined : {
		opacity: lineOpacity, stroke: lineStroke, x1: x1, y1: y1, x2: x2, y2: y2
	};
	return {
		coordinateBase: coordinateBase, coordinate: coordinate, line: line, orient: orient
	};
}

function drawOnCanvas(ctx, props) {
	var edge = helper(props);

	if (edge === null) return;

	if ((0, _utils.isDefined)(edge.coordinateBase)) {
		var _edge$coordinateBase2 = edge.coordinateBase,
		    rectWidth = _edge$coordinateBase2.rectWidth,
		    rectHeight = _edge$coordinateBase2.rectHeight,
		    arrowWidth = _edge$coordinateBase2.arrowWidth;


		ctx.fillStyle = (0, _utils.hexToRGBA)(edge.coordinateBase.fill, edge.coordinateBase.opacity);

		var x = edge.coordinateBase.edgeXRect;
		var y = edge.coordinateBase.edgeYRect;

		ctx.beginPath();

		if (edge.orient === "right") {
			ctx.moveTo(x, y + rectHeight / 2);
			ctx.lineTo(x + arrowWidth, y);
			ctx.lineTo(x + rectWidth + arrowWidth, y);
			ctx.lineTo(x + rectWidth + arrowWidth, y + rectHeight);
			ctx.lineTo(x + arrowWidth, y + rectHeight);
			ctx.closePath();
		} else if (edge.orient === "left") {
			ctx.moveTo(x, y);
			ctx.lineTo(x + rectWidth, y);
			ctx.lineTo(x + rectWidth + arrowWidth, y + rectHeight / 2);
			ctx.lineTo(x + rectWidth, y + rectHeight);
			ctx.lineTo(x, y + rectHeight);
			ctx.closePath();
		} else {
			ctx.rect(x, y, rectWidth, rectHeight);
		}
		ctx.fill();

		ctx.font = edge.coordinate.fontSize + "px " + edge.coordinate.fontFamily;
		ctx.fillStyle = edge.coordinate.textFill;
		ctx.textAlign = edge.coordinate.textAnchor === "middle" ? "center" : edge.coordinate.textAnchor;
		ctx.textBaseline = "middle";

		ctx.fillText(edge.coordinate.displayCoordinate, edge.coordinate.edgeXText, edge.coordinate.edgeYText);
	}
	if ((0, _utils.isDefined)(edge.line)) {
		ctx.strokeStyle = (0, _utils.hexToRGBA)(edge.line.stroke, edge.line.opacity);

		ctx.beginPath();
		ctx.moveTo(edge.line.x1, edge.line.y1);
		ctx.lineTo(edge.line.x2, edge.line.y2);
		ctx.stroke();
	}
}

// export default EdgeCoordinate;
//# sourceMappingURL=EdgeCoordinateV2.js.map