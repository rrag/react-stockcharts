"use strict";

import { slidingWindow } from "../utils";

export default function() {
  var dateAccessor = d => d.date;

  function calculator(data) {
    var intradayScaleCalculator = slidingWindow()
    .windowSize(2)
    .undefinedValue(d => {
      var row = { ...d, startOfQuarterHour: false, startOfHour: false, startOfQuarterDay: false, startOfDay: false, startOfWeek: false, midWeek: false };
      return row;
    })
    .accumulator(([prev, now]) => {
      var prevDate = dateAccessor(prev);
      var nowDate = dateAccessor(now);

      var startOfWeek = nowDate.getDay() < prevDate.getDay();

      var startOfDay = nowDate.getMinutes() == 0 && nowDate.getHours() == 0;

      var midWeek = startOfDay && nowDate.getDay() == 3;

      var startOfQuarterHour = nowDate.getMinutes() % 15 === 0; // need this? prob not

      var startOfHour = nowDate.getMinutes() == 0;

      var startOfQuarterDay = startOfHour && nowDate.getHours() % 3 === 0; // need this? prob not

      var row = { ...now, startOfQuarterHour, startOfHour, startOfQuarterDay, startOfDay, startOfWeek, midWeek };
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