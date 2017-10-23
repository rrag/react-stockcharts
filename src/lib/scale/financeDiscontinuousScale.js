"use strict";

import { set, map } from "d3-collection";
import { ascending } from "d3-array";
import { scaleLinear } from "d3-scale";

import { isDefined, isNotDefined, head, last } from "../utils";
import { levelDefinition } from "./levels";

const MAX_LEVEL = levelDefinition.length - 1;

export default function financeDiscontinuousScale(
	index,
	futureProvider,
	backingLinearScale = scaleLinear()
) {

	if (isNotDefined(index))
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

		if (Math.floor(domainEnd) > end) {
			// console.log(end, domainEnd, index);
		}

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
	scale.tickFormat = function() {
		return function(x) {
			const d = Math.abs(head(index).index);
			const { format, date } = index[x + d];
			return format(date);
		};
	};
	scale.value = function(x) {
		const d = Math.abs(head(index).index);
		if (isDefined(index[x + d])) {
			const { date } = index[x + d];
			return date;
		}
	};
	scale.nice = function(m) {
		backingLinearScale.nice(m);
		return scale;
	};
	scale.copy = function() {
		return financeDiscontinuousScale(index, futureProvider, backingLinearScale.copy());
	};
	return scale;
}