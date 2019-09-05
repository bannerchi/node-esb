'use strict';

const pm2 = require('pm2');

exports.start = function(name, pathToRun, args, execMode, cb){
	execMode =  execMode || 'fork';
	args = args || [];
	pm2.connect(function(err){
		if(err) {
			console.error(err);
			process.exit(2);
		}
		pm2.start({
			name : name,
			script : pathToRun,
			exec_mode : execMode,
			max_memory_restart: '200M',
			args : args
		}, function (err, apps) {
			pm2.disconnect();
			cb(apps[0]);
			if(err){
				throw err;
			}
		});
	});
};

exports.stop = function (processName, cb) {
	pm2.connect(function(err){
		if(err) {
			console.error(err);
			process.exit(2);
		}
		pm2.stop(processName, function (err, apps) {
			pm2.disconnect();
			cb(apps);
			console.log("stop process: " + processName);
			if(err){
				throw err;
			}
		});
	});
};

exports.restart = function (processName, cb) {
	pm2.connect(function(err){
		if(err) {
			console.error(err);
			process.exit(2);
		}
		pm2.restart(processName, function (err, apps) {
			pm2.disconnect();
			cb(apps);
			console.log("restart process :" + processName);
			if(err){
				throw err;
			}
		});
	});
};

exports.delete = function (processName, cb) {
	pm2.connect(function(err){
		if(err) {
			console.error(err);
			process.exit(2);
		}
		pm2.delete(processName, function (err, apps) {
			pm2.disconnect();
			cb(apps);
			console.log("delete process :" + processName);
			if(err){
				throw err;
			}
		});
	});
};

exports.desc = function (processName, cb) {
	pm2.connect(function(err){
		if(err) {
			console.error(err);
			process.exit(2);
		}
		pm2.describe(processName, function (err, apps) {
			pm2.disconnect();
			cb(apps);

			if(err){
				throw err;
			}
		});
	});
};