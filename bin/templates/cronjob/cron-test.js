'use strict';
const CronJob = require('node-esb').cronjob;

function CronTest() {
}

function runFunc(){
  console.log('test-cron' + new Date().getTime());
}

CronTest.prototype.run = function (pattern) {
    const cj = new CronJob();

    cj.start(pattern, runFunc);
};

module.exports = new CronTest();
