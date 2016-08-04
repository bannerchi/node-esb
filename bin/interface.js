#!/usr/bin/env node
var argvs = process.argv.slice(2);

var funcName = argvs[0];

if(funcName === 'listen'){
	var listenerId = argvs[1];
} else {
	console.log('no such func');
	process.exit(1);
}


