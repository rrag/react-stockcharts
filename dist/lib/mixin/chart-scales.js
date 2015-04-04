'use strict';

var ScaleUtils = require('../utils/scale-utils');


/*
    var scatterData = [
      {
        name: "series1",
        values: [ { x: 0, y: 20 }, { x: 5, y: 7 }, { x: 8, y: 3 }, { x: 13, y: 33 }, { x: 12, y: 10 }, { x: 13, y: 15 }, { x: 24, y: 8 }, { x: 25, y: 15 }, { x: 16, y: 10 }, { x: 16, y: 10 }, { x: 19, y: 30 }, { x: 14, y: 30 }]
      },
      {
        name: "series2",
        values: [ { x: 40, y: 30 }, { x: 35, y: 37 }, { x: 48, y: 37 }, { x: 38, y: 33 }, { x: 52, y: 60 }, { x: 51, y: 55 }, { x: 54, y: 48 }, { x: 45, y: 45 }, { x: 46, y: 50 }, { x: 66, y: 50 }, { x: 39, y: 36 }, { x: 54, y: 30 }]
      },
      {
        name: "series3",
        values: [ { x: 80, y: 78 }, { x: 71, y: 58 }, { x: 78, y: 68 }, { x: 81, y: 47 },{ x: 72, y: 70 }, { x: 70, y: 88 }, { x: 81, y: 90 }, { x: 92, y: 80 }, { x: 81, y: 72 }, { x: 99, y: 95 }, { x: 67, y: 81 }, { x: 96, y: 78 }]
      }
    ];

*/
var ChartScalesMixin = {
	calculateScales:function(height, width, data, keys) {
		if (height === undefined) height = this.props.height;
		if (width === undefined) width = this.props.width;
		if (data === undefined) data = this.props.data;

		if (height === undefined) {
			throw "cannot calculate scales for no height, either pass height as an argument or have this.props.height available"
		}
		if (width === undefined) {
			throw "cannot calculate scales for no width, either pass width as an argument or have this.props.width available"
		}
		if (data === undefined) {
			throw "cannot calculate scales for no data, either pass data as an argument or have this.props.data available"
		}

		window.addEventListener("keyup", this.handleEscHandlerMixinKeyPress);
		window.addEventListener("mousedown", this.handleEscHandlerMixinClick);
	},
	yScale:function() {
		window.removeEventListener("keyup", this.handleEscHandlerMixinKeyPress);
		window.removeEventListener("mousedown", this.handleEscHandlerMixinClick);
	}
};

module.exports = ChartScalesMixin;
