"use strict";

import { set, map } from "d3-collection";
import { bisector, ascending } from "d3-array";
import { scaleLinear } from "d3-scale";

import { isNotDefined, head, last } from "../utils";

var tickLevels = [
	{ target: 50e2, level: 0 },
	{ target: 50e3, level: 1 },
	{ target: 10e4, level: 2 },
	{ target: 28e4, level: 3 },
	{ target: 55e4, level: 4 },
	{ target: 11e5, level: 5 },
	{ target: 21e5, level: 6 },
	{ target: 43e5, level: 7 },
	{ target: 59e5, level: 8 }, // not tested
	{ target: 12e6, level: 9 }, // not tested
	{ target: 58e6, level: 10 }, // not tested
	{ target: 89e6, level: 11 },
	{ target: 11e7, level: 12 },
	{ target: 78e7, level: 13 },
	{ target: 16e8, level: 14 },
	{ target: 62e8, level: 15 },
	{ target: 10e20, level: 16 },
];

var MAX_LEVEL = 17;

var tickLevelBisector = bisector(function(d) { return d.target; }).left;

export default function financeDiscontinuousScale(index,
		interval,
		backingLinearScale = scaleLinear()) {

	if (isNotDefined(index) /* || isNotDefined(interval) */)
		throw new Error("Use the discontinuousTimeScaleProvider to create financeDiscontinuousScale");

	function scale(x) {
		return backingLinearScale(x);
	}
	scale.invert = function(x) {
		var inverted = backingLinearScale.invert(x);
		return Math.round(inverted * 10000) / 10000;
	};
	scale.domain = function(x) {
		if (!arguments.length) return backingLinearScale.domain();
		backingLinearScale.domain(x);
		return scale;
	};
	scale.range = function(x) {
		if (!arguments.length) return backingLinearScale.range();
		backingLinearScale.range(x);
		return scale;
	};
	scale.rangeRound = function(x) {
		return backingLinearScale.range(x);
	};
	scale.clamp = function(x) {
		if (!arguments.length) return backingLinearScale.clamp();
		backingLinearScale.clamp(x);
		return scale;
	};
	scale.interpolate = function(x) {
		if (!arguments.length) return backingLinearScale.interpolate();
		backingLinearScale.interpolate(x);
		return scale;
	};
	scale.ticks = function(m, flexTicks) {
		var backingTicks = backingLinearScale.ticks(m);
		var ticksMap = map();

		var [domainStart, domainEnd] = backingLinearScale.domain();

		var start = Math.max(Math.ceil(domainStart), head(index).index) + Math.abs(head(index).index);
		var end = Math.min(Math.floor(domainEnd), last(index).index) + Math.abs(head(index).index);

		var desiredTickCount = Math.ceil((end - start) / (domainEnd - domainStart) * backingTicks.length);

		for (let i = MAX_LEVEL; i >= 0; i--) {
			var ticksAtLevel = ticksMap.get(i);
			var temp = isNotDefined(ticksAtLevel)
				? []
				: ticksAtLevel.slice();

			for (let j = start; j <= end; j++) {
				if (index[j].level === i) {
					temp.push(index[j]);
				}
			}

			ticksMap.set(i, temp);
		}

		var unsortedTicks = [];
		for (let i = MAX_LEVEL; i >= 0; i--) {
			if ((ticksMap.get(i).length + unsortedTicks.length) > desiredTickCount * 1.5) break;
			unsortedTicks = unsortedTicks.concat(ticksMap.get(i).map(d => d.index));
		}

		var ticks = unsortedTicks.sort(ascending);

		// console.log(backingTicks.length, desiredTickCount, ticks, ticksMap);

		if (!flexTicks && end - start > ticks.length) {
			var ticksSet = set(ticks);

			var d = Math.abs(head(index).index);

			// ignore ticks within this distance
			var distance = Math.ceil(
				(backingTicks.length > 0
					? (last(backingTicks) - head(backingTicks)) / (backingTicks.length) / 4
					: 1) * 1.5);

			for (let i = 0; i < ticks.length - 1; i++) {
				for (let j = i + 1; j < ticks.length; j++) {
					if (ticks[j] - ticks[i] <= distance) {
						ticksSet.remove(index[ticks[i] + d].level >= index[ticks[j] + d].level ? ticks[j] : ticks[i]);
					}
				}
			}

			var tickValues = ticksSet.values().map(d => parseInt(d, 10));

			// console.log(ticks.length, tickValues, level);
			// console.log(ticks, tickValues, distance);

			return tickValues;
		}

		return ticks;
	};
	scale.ticksv1 = function(m) {

		var [domainStart, domainEnd] = backingLinearScale.domain();

		var start = Math.max(Math.ceil(domainStart), head(index).index) + Math.abs(head(index).index);
		var end = Math.min(Math.floor(domainEnd), last(index).index) + Math.abs(head(index).index);

		// console.log(index.length, domainStart, domainEnd, start, end)

		var newM = ((end - start) / (domainEnd - domainStart)) * m;
		// newM = newM <= 0 ? m : newM;
		var target = Math.round((end - start + 1) * interval / newM);

		// var subList = index.slice(start, end + 1);
		var levelIndex = tickLevelBisector(tickLevels, target);
		var { level } = tickLevels[levelIndex];
		// console.log(target, level, levelIndex)

		// console.log(target.toExponential(), level);

		var backingTicks = backingLinearScale.ticks(m);

		// console.log(backingTicks.length, ratio, distance, level)

		var ticks = [];
		for (let i = start; i < end + 1; i++) {
			if (index[i].level >= level) ticks.push(index[i].index);
		}

		// subList.filter(each => each.level >= level).map(d => d.index);

		var ticksSet = set(ticks);
		// console.log(ticks);

		var d = Math.abs(head(index).index);

		// ignore ticks within this distance
		var distance = Math.ceil(
			(backingTicks.length > 0
				? (last(backingTicks) - head(backingTicks)) / (backingTicks.length) / 4
				: 1) * 1.5);

		for (let i = 0; i < ticks.length - 1; i++) {
			for (var j = i + 1; j < ticks.length; j++) {
				if (ticks[j] - ticks[i] < distance) {
					ticksSet.remove(index[ticks[i] + d].level >= index[ticks[j] + d].level ? ticks[j] : ticks[i]);
				}
			}
		}

		var tickValues = ticksSet.values().map(d => parseInt(d, 10));
		// console.log(ticks.length, tickValues, level, distance);
		return tickValues;
	};
	scale.tickFormat = function() {
		return function(x) {
			// console.log(x)
			var d = Math.abs(head(index).index);
			var { format, date } = index[x + d];
			return format(date);
		};
	};
	scale.nice = function(m) {
		backingLinearScale.nice(m);
		return scale;
	};
	scale.copy = function() {
		return financeDiscontinuousScale(index, interval, backingLinearScale.copy());
	};
	return scale;
}