"use strict";

/*
 TRIMA (Triangular Moving Average).

 The Triangular Moving Average can be used like any other Moving Average, to obtain a smoother representation of the underlying data.
 It is important to note that the Triangular Moving Average is typically much smoother than other moving averages.

 Triangular moving averages give greater weight to prices at the centre of the chosen period andi it is calculated as double smoothed SMA (simple moving average).

 Examples:
   For TimeSerie={a,b,c,d,e,f...} ('a' is the older price)

   1st value for TRIMA 4-Period is:  ((1*a)+(2*b)+(2*c)+(1*d)) / 6
   2nd value for TRIMA 4-Period is:  ((1*b)+(2*c)+(2*d)+(1*e)) / 6

   1st value for TRIMA 5-Period is:  ((1*a)+(2*b)+(3*c)+(2*d)+(1*e)) / 9
   2nd value for TRIMA 5-Period is:  ((1*b)+(2*c)+(3*d)+(2*e)+(1*f)) / 9

 Using algebra, it can be demonstrated that the TRIMA is equivalent to
 doing a SMA of a SMA. The following explain the rules:

   (1) When the period is even, TRIMA(x,period)=SMA(SMA(x,period/2),(period/2)+1)
   (2) When the period is odd,  TRIMA(x,period)=SMA(SMA(x,(period+1)/2),(period+1)/2)

 In other word:
   (1) A period of 4 becomes TRIMA(x,4) = SMA( SMA( x, 2), 3 )
   (2) A period of 5 becomes TRIMA(x,5) = SMA( SMA( x, 3), 3 )

 The SMA of a SMA is the algorithm generally found in books.
*/

import { sum } from "d3-array";

import { slidingWindow } from "../../utils";
import { TRIMA as defaultOptions } from "../defaultOptionsForComputation";

export default function() {

    var { windowSize, sourcePath } = defaultOptions;

    function calculator(data)
    {

        var weight, n = Math.floor(windowSize/2);
        if ((windowSize % 2) == 0) {
            weight = n*(n+1);
        } else {
            weight = (n+1)*(n+1);
        }

        var triaverage = slidingWindow()
            .windowSize(windowSize)
            .sourcePath(sourcePath)
            .accumulator((values) => {
                return sum(values, function(v, i) {
                    return i < n ? ((i+1) * v) : ((windowSize - i) * v);
                }) / weight;
            });

        return triaverage(data);

    };
    calculator.undefinedLength = function() {
        return windowSize;
    };
    calculator.windowSize = function(x) {
        if (!arguments.length) {
            return windowSize;
        }
        windowSize = x;
        return calculator;
    };

    calculator.sourcePath = function(x) {
        if (!arguments.length) {
            return sourcePath;
        }
        sourcePath = x;
        return calculator;
    };

    return calculator;
}
