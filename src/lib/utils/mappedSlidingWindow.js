"use strict";

/*

Taken from https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/slidingWindow.js

The MIT License (MIT)

Copyright (c) 2014-2015 Scott Logic Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

import d3 from 'd3';
import noop from "./noop";
import identity from "./identity";

export default function() {

	var undefinedValue = undefined,
		windowSize = 10,
		accumulator = noop,
		source = identity,
		skipInitial = 0;

	var mappedSlidingWindow = function(data) {
		var size = d3.functor(windowSize).apply(this, arguments);
		var windowData = []; //data.slice(skipInitial, size + skipInitial).map(source);
		var accumulatorIdx = 0;
		var undef = d3.functor(undefinedValue);
		// console.log(skipInitial, size, data.length, windowData.length);
		var result = [];
		data.forEach(function(d, i) {
			// console.log(d, i, windowData.length);
			var mapped;
			if (i < (skipInitial + size - 1)) {
				mapped = undef(d, i)
				result.push(mapped);
				windowData.push(mapped);
				return;
			}
			if (i >= (skipInitial + size)) {
				// Treat windowData as FIFO rolling buffer
				windowData.shift();
			}
			windowData.push(source(d, i));
			mapped = accumulator(windowData, i, accumulatorIdx++)
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