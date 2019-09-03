#!/usr/bin/env node
const argvs = process.argv.slice(2);
const _ = require('lodash');

const funcName = argvs[0];

if(funcName === 'listen'){
	const func = argvs[1];
	const listenerId = argvs[2];
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
} else if(funcName === 'cron'){
	const func = argvs[1];
	const cronId = argvs[2];
	if(func === 'start'){
		if(!cronId){
			console.log('cronId is required');
			process.exit(1);
		}
		if (!cronId.toString().match(/[^0-9||all]/)) {
			require('../core/dispatcher')().startCron(cronId.toString());
		} else {
			console.log('cronId can only be numbers or "all"');
			process.exit(1);
		}
	}
} else {
	console.log('no such func');
	process.exit(1);
}


