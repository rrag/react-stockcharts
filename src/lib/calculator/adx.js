

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


import { ADX as defaultOptions } from "./defaultOptionsForComputation";

export default function () {

	let options = defaultOptions;
	function calculator(data) {
		const { windowSize } = options;

		const FindTR = (DMIP, DMIM, TR, Last, PrevLast) => {

			if (Last.high > PrevLast.high) {
				DMIP = Last.high - PrevLast.high
			} else {
				DMIP = 0;
			}

			if (Last.low < PrevLast.low) {
				DMIM = PrevLast.low - Last.low
			} else {
				DMIM = 0
			}

			if (DMIP > DMIM) {
				DMIM = 0
			} else if (DMIM > DMIP) {
				DMIP = 0
			} else if (DMIM = DMIP) {
				DMIM = 0
				DMIM = 0
			}

			TR = Math.max(Last.high - Last.low, Last.high - PrevLast.close, Last.low - PrevLast.close);

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

				DXval = ((DIPline - DIMline) / (DIPline + DIMline)) * 100

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
