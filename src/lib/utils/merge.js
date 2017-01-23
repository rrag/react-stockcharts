/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/merge.js

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

import identity from "./identity";
import zipper from "./zipper";
import noop from "./noop";

import { isNotDefined } from "./index";

// applies an algorithm to an array, merging the result back into
// the source array using the given merge function.
export default function() {

	let algorithm = identity,
		skipUndefined = true,
		merge = noop;

	function mergeCompute(data) {
		const zip = zipper()
			.combine((datum, indicator) => {
				const result = (skipUndefined && isNotDefined(indicator))
					? datum
					: merge(datum, indicator);
				return isNotDefined(result) ? datum : result;
			});

		// console.log(data);
		return zip(data, algorithm(data));
	}

	mergeCompute.algorithm = function(x) {
		if (!arguments.length) {
			return algorithm;
		}
		algorithm = x;
		return mergeCompute;
	};

	mergeCompute.merge = function(x) {
		if (!arguments.length) {
			return merge;
		}
		merge = x;
		return mergeCompute;
	};
	mergeCompute.skipUndefined = function(x) {
		if (!arguments.length) {
			return skipUndefined;
		}
		skipUndefined = x;
		return mergeCompute;
	};

	return mergeCompute;
}