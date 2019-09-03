#!/usr/bin/env node
"use strict";
const chalk = require('chalk');
const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

program
    .option('-c, --cron [name]', 'create cron dir')
    .option('-e, --exchange [name]', 'create exchange dir')
    .option('-q, --queue [name]', 'create queue')
    .parse(process.argv);


if (program.cron) {
    mkDir('./connector/cron', function(){
	    setCronFile('./connector/cron', program.cron);
    });
} else if (program.exchange && !program.queue) {
    mkDir('./exchange/' + program.exchange);
} else if(program.exchange && program.queue){
    mkDir('./exchange/' + program.exchange, function () {
        setQueueFile('./exchange/' + program.exchange, program.queue);
    });
} else {
    const dirs = ['exchange','connector','esb-config'];
    buildDirs(dirs);
}

/**
 * make dir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkDir(path, fn) {
    shell.mkdir('-p', path);
    shell.chmod(755, path);
    console.log(chalk.cyan('create :'), path);
    if (fn) fn();
}

function setCronFile(path, fileName) {
	write(path + '/' + fileName + '.js', readTemplate('cronjob/cron-test.js'));
	console.log(chalk.cyan('create cron:'), fileName);
}

function setQueueFile(path, fileName){
	write(path + '/' + fileName + '.js', readTemplate('my-exchange/queue-test.js'));
    console.log(chalk.cyan('create queue:'), fileName);
}

function readTemplate(path) {
	const template = fs.readFileSync(__dirname + '/templates/' + path, 'utf8');

	return template;
}

function write(path, str) {
	fs.writeFile(path, str);
	console.log(chalk.cyan('   create:'), path);
}

function buildDirs(dirs) {
    dirs.forEach( function (dir) {
        fs.stat('./' +  dir, function (err, stats) {
            if (err) {
	            if(dir === 'esb-config'){
		            mkDir(dir, function () {
			            write('./esb-config/default.js', readTemplate('config/default.js'));
		            });
	            } else{
		            mkDir(dir);
	            }
            } else if (stats.isDirectory ()) {
                console.error(chalk.red('exists:'), dir);
            }
        });
    });
}