'use strict';

var Freezer = require('freezer-js');

// Let's create a freezer store
var store = new Freezer({
	foo: {_idx: 0, bar: 'bar'},
	arr: [99, 17]
});

store.on('update', function(){
	console.log( 'I was updated, \n', store.get());
});

var data = store.get();

var foo = {_idx: 22, foo: 'foobar'};

var newFoo = store.get().foo.replace(foo);

console.log('herehere', newFoo);

//store.set().foo.set(foo);
