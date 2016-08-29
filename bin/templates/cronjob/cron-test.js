'use strict';
var CronJob = require('node-esb').cronjob;

function CronTest() {
}

function runFunc(){
  console.log('test-cron' + new Date().getTime());
}

CronTest.prototype.run = function (pattern) {
  var cj = new CronJob();

  cj.start(pattern, runFunc);
};

module.exports = new CronTest();
