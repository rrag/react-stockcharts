'use strict';

var Freezer = require('freezer-js');

// Let's create a freezer store
var store = new Freezer({
	tooltip: [{ type: 'ma', yAccessor: function(d) { return d.close; } }],
	mouseXY: [0, 1000],
	mouseOver : false,
	currentItem: {_idx: 0, displayDate: '2010-02-02', open: 10, high: 20, low: 5, close: 15},
	lastItem: {_idx: 0, displayDate: '2010-02-02', open: 10, high: 20, low: 5, close: 15}
});
// Let's get the data stored
var data = store.get();

// Listen on changes in the store
/*store.on('update', function(){
	console.log( 'I was updated, \n', store.get());
});

var listener = data.mouseXY.getListener();

listener.on('update', function(d) {
	console.log('%s is updated', d);
	console.log(store.get());
})
*/
var currentItem = {_idx: 1, displayDate: '2011-02-02', open: 10, high: 20, low: 5, close: 15};

console.log(currentItem);
console.log(store.get().currentItem);

currentItem = store.get().currentItem.set(currentItem);

console.log(currentItem);
