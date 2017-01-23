"use strict";

import { set, map } from "d3-collection";
import { bisector, ascending } from "d3-array";
import { scaleLinear } from "d3-scale";

import { isNotDefined, head, last } from "../utils";

const tickLevels = [
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

const MAX_LEVEL = 17;

const tickLevelBisector = bisector(function(d) { return d.target; }).left;

export default function financeDiscontinuousScale(index,
		interval,
		backingLinearScale = scaleLinear()) {

	if (isNotDefined(index) /* || isNotDefined(interval) */)
		throw new Error("Use the discontinuousTimeScaleProvider to create financeDiscontinuousScale");

	function scale(x) {
		return backingLinearScale(x);
	}
	scale.invert = function(x) {
		const inverted = backingLinearScale.invert(x);
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
		const backingTicks = backingLinearScale.ticks(m);
		const ticksMap = map();

		const [domainStart, domainEnd] = backingLinearScale.domain();

		const start = Math.max(Math.ceil(domainStart), head(index).index) + Math.abs(head(index).index);
		const end = Math.min(Math.floor(domainEnd), last(index).index) + Math.abs(head(index).index);

		const desiredTickCount = Math.ceil((end - start) / (domainEnd - domainStart) * backingTicks.length);

		for (let i = MAX_LEVEL; i >= 0; i--) {
			const ticksAtLevel = ticksMap.get(i);
			const temp = isNotDefined(ticksAtLevel)
				? []
				: ticksAtLevel.slice();

			for (let j = start; j <= end; j++) {
				if (index[j].level === i) {
					temp.push(index[j]);
				}
			}

			ticksMap.set(i, temp);
		}

		let unsortedTicks = [];
		for (let i = MAX_LEVEL; i >= 0; i--) {
			if ((ticksMap.get(i).length + unsortedTicks.length) > desiredTickCount * 1.5) break;
			unsortedTicks = unsortedTicks.concat(ticksMap.get(i).map(d => d.index));
		}

		const ticks = unsortedTicks.sort(ascending);

		// console.log(backingTicks.length, desiredTickCount, ticks, ticksMap);

		if (!flexTicks && end - start > ticks.length) {
			const ticksSet = set(ticks);

			const d = Math.abs(head(index).index);

			// ignore ticks within this distance
			const distance = Math.ceil(
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

			const tickValues = ticksSet.values().map(d => parseInt(d, 10));

			// console.log(ticks.length, tickValues, level);
			// console.log(ticks, tickValues, distance);

			return tickValues;
		}

		return ticks;
	};
	scale.ticksv1 = function(m) {

		const [domainStart, domainEnd] = backingLinearScale.domain();

		const start = Math.max(Math.ceil(domainStart), head(index).index) + Math.abs(head(index).index);
		const end = Math.min(Math.floor(domainEnd), last(index).index) + Math.abs(head(index).index);

		// console.log(index.length, domainStart, domainEnd, start, end)

		const newM = ((end - start) / (domainEnd - domainStart)) * m;
		// newM = newM <= 0 ? m : newM;
		const target = Math.round((end - start + 1) * interval / newM);

		// var subList = index.slice(start, end + 1);
		const levelIndex = tickLevelBisector(tickLevels, target);
		const { level } = tickLevels[levelIndex];
		// console.log(target, level, levelIndex)

		// console.log(target.toExponential(), level);

		const backingTicks = backingLinearScale.ticks(m);

		// console.log(backingTicks.length, ratio, distance, level)

		const ticks = [];
		for (let i = start; i < end + 1; i++) {
			if (index[i].level >= level) ticks.push(index[i].index);
		}

		// subList.filter(each => each.level >= level).map(d => d.index);

		const ticksSet = set(ticks);
		// console.log(ticks);

		const d = Math.abs(head(index).index);

		// ignore ticks within this distance
		const distance = Math.ceil(
			(backingTicks.length > 0
				? (last(backingTicks) - head(backingTicks)) / (backingTicks.length) / 4
				: 1) * 1.5);

		for (let i = 0; i < ticks.length - 1; i++) {
			for (let j = i + 1; j < ticks.length; j++) {
				if (ticks[j] - ticks[i] < distance) {
					ticksSet.remove(index[ticks[i] + d].level >= index[ticks[j] + d].level ? ticks[j] : ticks[i]);
				}
			}
		}

		const tickValues = ticksSet.values().map(d => parseInt(d, 10));
		// console.log(ticks.length, tickValues, level, distance);
		return tickValues;
	};
	scale.tickFormat = function() {
		return function(x) {
			// console.log(x)
			const d = Math.abs(head(index).index);
			const { format, date } = index[x + d];
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