'use strict';

var Freezer = require('freezer-js');

// Let's create a freezer store
var store = new Freezer({
	foo: {_idx: 0, bar: 'bar'}
});
var data = store.get();

var foo = {_idx: 0, bar: 'foobar'};

console.log(foo);
console.log(store.get().foo);

foo = store.get().foo.set(foo);

console.log(foo);

//store.set().foo.set(foo);
