"use strict";

import { slidingWindow } from "../utils";

export default function() {
  var dateAccessor = d => d.date;

  function calculator(data) {
    var intradayScaleCalculator = slidingWindow()
    .windowSize(2)
    .undefinedValue(d => {
      var row = { ...d, startOfQuarterHour: false, startOfHour: false, startOfQuarterDay: false };
      return row;
    })
    .accumulator(([prev, now]) => {
      var prevDate = dateAccessor(prev);
      var nowDate = dateAccessor(now);

      var startOfQuarterHour = nowDate.getMinutes() % 15 === 0;

      var startOfHour = nowDate.getMinutes() == 0;

      var startOfQuarterDay = startOfHour && nowDate.getHours() % 3 === 0;

      var row = { ...now, startOfQuarterHour, startOfHour, startOfQuarterDay };
      return row;
    });
    var newData = intradayScaleCalculator(data);
    return newData;
  }
  calculator.dateAccessor = function(x) {
    if (!arguments.length) {
      return dateAccessor;
    }
    dateAccessor = x;
    return calculator;
  };
  return calculator;
}