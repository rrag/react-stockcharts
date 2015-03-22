'use strict';

var Freezer = require('freezer-js');
// Let's create a freezer store
var store = new Freezer({
    tooltip: {
        ma0 : { yAccessor: function(d) { return d.close; }},
        ma1 : { yAccessor: function(d) { return d.close; }},
        ma2 : { yAccessor: function(d) { return d.close; }}
    },
    eventCapture: {
        mouseXY: [0, 0],
        mouseOver: { value: false },
        inFocus: { value: false },
        zoom: { value : 0 }
    },
    currentItem: {},
    lastItem: {},
    data: []
});

var data = store.get();

var mouseOverListener = data.mouseOver.getListener();
mouseOverListener.on('update', function(d) {
    console.log('mouse over : %s', d.value);
})

var mouseXYListener = data.mouseXY.getListener();
mouseXYListener.on('update', function(d) {
    console.log('mouse xy : [%s, %s]', d[0], d[1]);
})
