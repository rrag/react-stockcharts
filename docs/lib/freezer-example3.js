'use strict';

var Freezer = require('freezer-js');
var d3 = require('d3');

// Let's create a freezer store
var store = new Freezer({
	foo: {_idx: 0, bar: 'bar', arr: [0, 1] },
	arr: [99, 17],
	bar: 1
});

store.on('update', function(){
	console.log( 'I was updated, \n', store.get());
	store.get().set('bar', store.get().bar + 1);
});

var data = store.get();
/*
var foo = {_idx: 22, foo: 'foobar', arr: [9, 10] };

data.foo.scale.range( [10, 20] );

console.log( '********', store.get().foo.scale.range());
var newFoo = store.get().foo.set(foo);

console.log('herehere', newFoo);
*/
//store.set().foo.set(foo);

console.log(data.bar === 1);
data.set('bar', 1);

