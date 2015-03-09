'use strict';

var logger;

var templogger = {
	log: console.log,
	table: console.table,
	trace: () => {},
	debug: () => {},
	info: console.log,
	warn: console.warn,
	error: console.warn,
	time: console.time,
	timeEnd: console.timeEnd,
	dir: console.dir
}

var logger = "production" !== process.env.NODE_ENV
	? require('tracer').colorConsole()
	: templogger;

module.exports = logger;

//	? require('bunyan').createLogger({name: 'play', level: 'debug'})
//	? require('tracer').console()
//	? require('better-console')
