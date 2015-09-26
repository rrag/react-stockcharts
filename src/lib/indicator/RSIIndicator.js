"use strict";

import objectAssign from "object-assign";

var defaultOptions = {
	period: 14,
	pluck: "close",
	overSold: 70,
	overBought: 30,
};

function RSIIndicator(options, chartProps, dataSeriesProps) {

	var prefix = `chart_${ chartProps.id }`;
	var key = `overlay_${ dataSeriesProps.id }`;

	var settings = objectAssign({}, defaultOptions, options);
	function indicator() {
	}
	indicator.options = function() {
		return settings;
	};
	indicator.calculate = function(data) {
		var { period, pluck } = settings;

		var getter = (d) => d[pluck];
		var now, prev, change;

		var first = data[0];
		first[prefix] = {};
		first[prefix][key] = {};

		for (var i = 1; i < data.length; i++) {
			now = data[i];
			prev = data[i - 1];
			now[prefix] = {};
			now[prefix][key] = {};

			change = getter(now) - getter(prev);
			now[prefix][key].gain = Math.max(change, 0);
			now[prefix][key].loss = Math.min(change, 0);

			if (prev[prefix][key].avgGain === undefined) {
				// first avg gain & loss
				if (i >= period) {
					// calculate first average after n periods
					var firstN = data.slice(1, i - 1);
					now[prefix][key].avgGain = firstN
						.map(d => d[prefix][key].gain)
						.reduce((a, b) => a + b) / period;

					now[prefix][key].avgLoss = firstN
						.map(d => d[prefix][key].loss)
						.reduce((a, b) => a + b) / period;
				}
			} else {
				// subsequent avg gain & loss
				now[prefix][key].avgGain = (prev[prefix][key].avgGain * (period - 1) + now[prefix][key].gain) / period;
				now[prefix][key].avgLoss = (prev[prefix][key].avgLoss * (period - 1) + now[prefix][key].loss) / period;
			}
			if (now[prefix][key].avgGain !== undefined) {
				now[prefix][key].relativeStrength = now[prefix][key].avgGain / Math.abs(now[prefix][key].avgLoss);
				now[prefix][key].rsi = 100 - (100 / ( 1 + now[prefix][key].relativeStrength ));
			}
		}
		// console.log(data[data.length - 3]);
		return data;
	};
	indicator.yAccessor = function() {
		return (d) => {
			// console.log(d[prefix][key]);
			if (d && d[prefix]) return d[prefix][key].rsi;
		};
	};
	indicator.domain = function() {
		return [0, 100];
	};
	indicator.yTicks = function() {
		return [settings.overSold, 50, settings.overBought];
	};
	indicator.isRSI = function() {
		return true;
	};
	return indicator;
}

export default RSIIndicator;
