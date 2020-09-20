

/*
https://github.com/ScottLogic/d3fc/blob/master/src/indicator/algorithm/calculator/relativeStrengthIndex.js

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

import { mean, sum, max, min } from "d3-array";
import { number } from "prop-types";

import {
	slidingWindow,
	trueRange,
	plusDMCalculation,
	minusDMCalculation, last
} from "../utils";
import { ADX as defaultOptions } from "./defaultOptionsForComputation";

export default function () {

	let options = defaultOptions;
	let source = d => ({ high: d.high, low: d.low, close: d.close, tp: d.tp, adx: d.adx });

	function calculator(data) {
		const { windowSize } = options;

		// const high = d => source(d).high,
		// 	low = d => source(d).low,
		// 	close = d => source(d).close,
		// 	tp = d => source(d).tp;

		const FindDMIHiLowRange = slidingWindow()
			.accumulator(([prev, curr]) => {

				let DMIM, DMIP;
				let hiDiff = curr.high - prev.high;
				let loDiff = curr.low - prev.low;
				let devN = (windowSize - 1) / windowSize;

				if (hiDiff < 0 && loDiff < 0 || hiDiff == loDiff) {
					DMIM = 0;
					DMIP = 0;
				}
				if (hiDiff > loDiff) {
					DMIP = hiDiff;
					DMIM = 0;
				}
				if (hiDiff < loDiff) {
					DMIM = loDiff;
					DMIP = 0;
				}

				let tmp = Math.max(Math.abs(curr.high - curr.low), Math.abs(prev.close - curr.high))
				let TR = Math.max(tmp, Math.abs(prev.close - curr.low));

				let sumDMIM = Number();
				let sumDMIP = Number();
				let sumTR = Number();

				sumDMIM = devN * sumDMIM + DMIM;
				sumDMIP = devN * sumDMIP + DMIP;
				sumTR = devN * sumTR + TR;

				let plusDI = 100 * (sumDMIP / sumTR);
				let minusDI = 100 * (sumDMIM / sumTR);

				let DXval = ((100 * Math.abs(plusDI - minusDI) / (plusDI + minusDI)))

				if (isNaN(DXval)) {
					DXval = 0;
				}

				let adx = Number();
				adx = ((adx * (windowSize - 1) + DXval) / windowSize)

				return { plusDI: Math.abs(plusDI), minusDI: Math.abs(minusDI), adxValue: Math.abs(adx) }

			})

		const FindTR = (DMIP, DMIM, TR, Last, PrevLast) => {

			let hiDiff = Last.high - PrevLast.high;
			let loDiff = Last.low - PrevLast.low;

			if (hiDiff < 0 && loDiff < 0 || hiDiff == loDiff) {
				DMIM = 0;
				DMIP = 0;
			}
			if (hiDiff > loDiff) {
				DMIP = hiDiff;
				DMIM = 0;
			}
			if (hiDiff < loDiff) {
				DMIM = loDiff;
				DMIP = 0;
			}

			let tmp = Math.max(Math.abs(Last.high - Last.low), Math.abs(PrevLast.close - Last.high))
			TR = Math.max(tmp, Math.abs(PrevLast.close - Last.low));

			return { DMIP, DMIM, TR }
		}

		const adxIndicator = (data) => {
			let TR = 0;
			let DMIP = 0;
			let DMIM = 0;
			let sumDMIM = 0;
			let sumDMIP = 0;
			let sumTR = 0;
			let ADXVal = 0;
			let devN = (windowSize - 1) / windowSize;
			let nMinus = windowSize - 1;
			let ind = 0;
			let DIPline = 0;
			let DIMline = 0;
			let DXval = 0;
			let adxArr = [];

			for (ind = 1; ind < data.length; ind++) {

				const finded = FindTR(DMIP, DMIM, TR, data[ind], data[ind - 1]);

				sumDMIM = devN * sumDMIM + finded.DMIM;
				sumDMIP = devN * sumDMIP + finded.DMIP;
				sumTR = devN * sumTR + finded.TR;

				DIPline = 100 * (sumDMIP / sumTR)
				DIMline = 100 * (sumDMIM / sumTR)

				DXval = ((100 * Math.abs(DIPline - DIMline) / (DIPline + DIMline)))

				if (isNaN(DXval)) {
					DXval = 0;
				}

				ADXVal = ((ADXVal * nMinus) + DXval) / windowSize;

				if (ind > nMinus) {
					ADXVal = ADXVal
				} else {
					ADXVal = 0;
				}

				adxArr.push({ plusDI: Math.abs(DIPline), minusDI: Math.abs(DIMline), adxValue: Math.abs(ADXVal) })

			}
			return adxArr;
		}

		const finalData = adxIndicator(data);

		return finalData;
	}
	calculator.undefinedLength = function () {
		const { windowSize } = options;

		return windowSize - 1;
	};
	calculator.options = function (x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};

	return calculator;
}
