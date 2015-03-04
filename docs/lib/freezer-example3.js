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

var foo = {_idx: 0, bar: 'foobar'};

console.log(foo);
console.log(store.get().foo);

store.get().foo.set(foo);

var i = 0,j = 0;
for (i = 0; i < 10000000; i++) {
	j++;
}

var arr = [];
for (i = 0; i < 10; i++) {
    arr.push(i);
}

data.arr.append(arr);

console.log('herehere', arr);

//store.set().foo.set(foo);
