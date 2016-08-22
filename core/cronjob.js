'use strict';

var cron = require('../lib/cron');

/**
 * config such as {runOnInit: true, timeZone: 'Asia/Shanghai' }
 * @param config
 * @constructor
 */
function CronJob(config) {
  this.config = config || {
		runOnInit : true,
		timeZone : null //default 'Asia/Shanghai'
	  };
}

CronJob.prototype.start = function (pattern, runFunc) {
  	cron.createJob(
		pattern,
		runFunc,
		this.config.runOnInit,
		this.config.timeZone
	);
};

module.exports = CronJob;