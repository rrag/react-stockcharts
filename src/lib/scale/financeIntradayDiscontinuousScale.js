"use strict";

import d3 from "d3";

import { isDefined, isNotDefined } from "../utils";

export default function financeIntradayScale(indexAccessor = d => d.idx, dateAccessor = d => d.date, data = [0, 1], backingLinearScale = d3.scale.linear()) {

  var timeScaleSteps = [
    { step: 36e5, f: function(d) { return isDefined(dateAccessor(d)) && d.startOfQuarterHour; } }, // 1 hour
    { step: 108e5, f: function(d) { return isDefined(dateAccessor(d)) && d.startOfHour; } }, // 3 hours
    { step: 216e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || (d.startOfHour && dateAccessor(d).getUTCHours() % 3 == 0)); } }, // 6 hours
    { step: 432e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || (d.startOfHour && dateAccessor(d).getUTCHours() % 6 == 0)); } }, // 12 hours
    { step: 864e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay || (d.startOfHour && dateAccessor(d).getUTCHours() % 12 == 0)); } },  // 1-day
    { step: 2592e5, f: function(d) { return isDefined(dateAccessor(d)) && d.startOfDay; } },  // 3-day, doesnt work with 2h scale
    { step: 6048e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay && dateAccessor(d).getDate() % 3 == 0); } },  // 7-day
    { step: 12096e5, f: function(d) { return isDefined(dateAccessor(d)) && (d.startOfDay && dateAccessor(d).getDate() % 3 == 0); } }  // 14-day
  ];
  var timeScaleStepsBisector = d3.bisector(function(d) { return d.step; }).left;
  var bisectByIndex = d3.bisector(function(d) { return indexAccessor(d); }).left;
  var tickFormat = [
    [d3.time.format("%_I %p"), function(d) { return d.startOfHour && !d.startOfDay }],
    [d3.time.format("%a %d"), function(d) { return d.startOfDay }],
    [d3.time.format("%I:%M %p"), function(d) { return true; }] // accumulator fallback for first entry
  ];
  function formater(d) {
    var i = 0, format = tickFormat[i];
    while (!format[1](d)) format = tickFormat[++i];
    var tickDisplay = format[0](dateAccessor(d));
    // console.log(t;ickDisplay);
    return tickDisplay;
  }

  function scale(x) {
    return backingLinearScale(x);
  }
  scale.isPolyLinear = function() {
    return true;
  };
  scale.invert = function(x) {
    return backingLinearScale.invert(x);
  };
  scale.data = function(x) {
    if (!arguments.length) {
      return data;
    } else {
      data = x;
      // this.domain([data.first().index, data.last().index]);
      this.domain([indexAccessor(data[0]), indexAccessor(data[data.length - 1])]);
      return scale;
    }
  };
  scale.indexAccessor = function(x) {
    if (!arguments.length) return indexAccessor;
    indexAccessor = x;
    return scale;
  };
  scale.dateAccessor = function(x) {
    if (!arguments.length) return dateAccessor;
    dateAccessor = x;
    return scale;
  };
  scale.domain = function(x) {
    if (!arguments.length) return backingLinearScale.domain();
    // console.log("before = %s, after = %s", JSON.stringify(backingLinearScale.domain()), JSON.stringify(x))

    var d = [x[0], x[1]];
    // console.log(d);
    backingLinearScale.domain(d);
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
  scale.ticks = function(m) {
    var start, end, count = 0;
    data.forEach(function(d) {
      if (isDefined(dateAccessor(d))) {
        if (isNotDefined(start)) start = d;
        end = d;
        count++;
      }
    });
    // var start = head(data);
    // var end = last(data);
    // console.log(data);
    m = (count / data.length) * m;
    var span = (dateAccessor(end).getTime() - dateAccessor(start).getTime());
    var target = span / m;

    // console.log(dateAccessor(data[data.length - 1])
    //   , data[0]
    //   , span
    //   , m
    //   , target
    //   , timeScaleStepsBisector(timeScaleSteps, target)
    //   , count
    //   , data.length
    //   );

    var scaleIndex = timeScaleStepsBisector(timeScaleSteps, target);

    console.log(timeScaleSteps[scaleIndex].step);
    
    var ticks = data
            .filter(timeScaleSteps[scaleIndex].f)
            .map(indexAccessor)
            ;
    // return the index of all the ticks to be displayed,
    // console.log(target, span, m, ticks);
    return ticks;
  };
  scale.tickFormat = function(/* ticks */) {
    return function(d) {
      // for each index received from ticks() function derive the formatted output
      var tickIndex = bisectByIndex(data, d);
      return formater(data[tickIndex]);
    };
  };
  scale.nice = function(m) {
    backingLinearScale.nice(m);
    return scale;
  };
  scale.copy = function() {
    return financeIntradayScale(indexAccessor, dateAccessor, data, backingLinearScale.copy());
  };
  return scale;
};