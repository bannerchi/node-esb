#!/usr/bin/env node
var chalk = require('chalk');
var program = require('commander');
program
	.option('-t, --test', 'just test')
	.parse(process.argv);

var listenerId = program.args;

 if (!listenerId.length) {
 	console.error('listenerId required');
 	process.exit(1);
 } else if (listenerId.toString().match(/[^0-9||all]/)) {
	 console.error('listenerId can only be numbers or all');
	 process.exit(1);
 }


if(program.test){
	// base path + exchange name  ex: ../connectors/myExchange
	var f1 = '../example/my-exchange';
	var allQueue = require('require-dir')(f1);
	var listener = allQueue['queue-test'];
	listener.start();
}else{
	require('../core/dispatcher')().startListener(listenerId);
}


