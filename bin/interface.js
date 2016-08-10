#!/usr/bin/env node
var argvs = process.argv.slice(2);
var _ = require('lodash');

var funcName = argvs[0];

if(funcName === 'listen'){
	var func = argvs[1];
	var listenerId = argvs[2];
	if(func === 'start'){
		if(!listenerId){
			console.log('listenerId is required');
			process.exit(1);
		}
		if (!listenerId.toString().match(/[^0-9||all]/)) {
			require('../core/dispatcher')().startListener(listenerId);
		} else {
			console.log('listenerId can only be numbers or all');
			process.exit(1);
		}
	}
} else {
	console.log('no such func');
	process.exit(1);
}


