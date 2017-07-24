"use strict";

import noop from "./noop";
import identity from "./identity";
import { functor } from "./index";

export default function() {

	let undefinedValue = undefined,
		windowSize = 10,
		accumulator = noop,
		source = identity,
		skipInitial = 0;

	// eslint-disable-next-line prefer-const
	let mappedSlidingWindow = function(data) {
		const size = functor(windowSize).apply(this, arguments);
		const windowData = [];
		let accumulatorIdx = 0;
		const undef = functor(undefinedValue);
		// console.log(skipInitial, size, data.length, windowData.length);
		const result = [];
		data.forEach(function(d, i) {
			// console.log(d, i, windowData.length);
			let mapped;
			if (i < (skipInitial + size - 1)) {
				mapped = undef(d, i);
				result.push(mapped);
				windowData.push(mapped);
				return;
			}
			if (i >= (skipInitial + size)) {
				// Treat windowData as FIFO rolling buffer
				windowData.shift();
			}
			windowData.push(source(d, i));
			mapped = accumulator(windowData, i, accumulatorIdx++);
			result.push(mapped);
			windowData.pop();
			windowData.push(mapped);
			return;
		});
		return result;
	};

	mappedSlidingWindow.undefinedValue = function(x) {
		if (!arguments.length) {
			return undefinedValue;
		}
		undefinedValue = x;
		return mappedSlidingWindow;
	};
	mappedSlidingWindow.windowSize = function(x) {
		if (!arguments.length) {
			return windowSize;
		}
		windowSize = x;
		return mappedSlidingWindow;
	};
	mappedSlidingWindow.accumulator = function(x) {
		if (!arguments.length) {
			return accumulator;
		}
		accumulator = x;
		return mappedSlidingWindow;
	};
	mappedSlidingWindow.skipInitial = function(x) {
		if (!arguments.length) {
			return skipInitial;
		}
		skipInitial = x;
		return mappedSlidingWindow;
	};
	mappedSlidingWindow.source = function(x) {
		if (!arguments.length) {
			return source;
		}
		source = x;
		return mappedSlidingWindow;
	};

	return mappedSlidingWindow;
}