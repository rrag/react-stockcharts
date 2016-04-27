"use strict";

import { slidingWindow } from "../utils";

export default function() {
  var dateAccessor = d => d.date;

  function calculator(data) {
    var intradayScaleCalculator = slidingWindow()
    .windowSize(2)
    .undefinedValue(d => {
      var row = { ...d, startOfQuarterHour: false, startOfHour: false, startOfEighthDay: false, startOfQuarterDay: false, startOfHalfDay: false, startOfDay: false, startOfWeek: false };
      return row;
    })
    .accumulator(([prev, now]) => {
      var prevDate = dateAccessor(prev);
      var nowDate = dateAccessor(now);

      var startOfQuarterHour = nowDate.getMinutes() % 15 === 0;

      var startOfHour = nowDate.getMinutes() == 0;

      var startOfEighthDay = startOfHour && nowDate.getUTCHours() % 3 === 0;
      var startOfQuarterDay = startOfHour && nowDate.getUTCHours() % 6 === 0;
      var startOfHalfDay = startOfHour && nowDate.getUTCHours() % 12 === 0;

      var startOfDay = nowDate.getMinutes() == 0 && nowDate.getUTCHours() == 0;

      var startOfWeek = nowDate.getDay() < prevDate.getDay();

      var row = { ...now, startOfQuarterHour, startOfHour, startOfEighthDay, startOfQuarterDay, startOfHalfDay, startOfDay, startOfWeek };
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