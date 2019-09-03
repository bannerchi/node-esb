'use strict';

const CronJob = require('cron').CronJob;

exports.createJob = function (pattern, runFunc, runOnInit, timeZone) {
	timeZone = timeZone || 'Asia/Shanghai';
	try {
		return new CronJob(pattern, runFunc, null, runOnInit, timeZone);
	} catch(ex) {
		console.log("cron pattern not valid");
		process.exit(2);
	}
};