#!/usr/bin/env node
"use strict";
var chalk = require('chalk');
var program = require('commander');
var shell = require('shelljs');
var fs = require('fs');
var path = require('path');

program
    .option('-c, --cron [name]', 'create cron dir')
    .option('-e, --exchange [name]', 'create exchange dir')
    .option('-q, --queue [name]', 'create queue')
    .parse(process.argv);


if (program.cron) {
    mkDir('./connector/' + program.cron);
} else if (program.exchange && !program.queue) {
    mkDir('./exchange/' + program.exchange);
} else if(program.exchange && program.queue){
    mkDir('./exchange/' + program.exchange, function () {
        setQueueFile('./exchange/' + program.exchange, program.queue);
    });
} else {
    var dirs = ['exchange','connector'];
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
    console.log(chalk.cyan('create exchange:'), path);
    if (fn) fn();
}

function setQueueFile(path, fileName){
    shell.cp('./example/my-exchange/queue-test.js', path + '/' + fileName + '.js');
    console.log(chalk.cyan('create queue:'), fileName);
}

function buildDirs(dirs) {
    dirs.forEach( function (dir) {
        fs.stat('./' +  dir, function (err, stats) {
            if (err) {
                mkDir(dir);
            } else if (stats.isDirectory ()) {
                console.error(chalk.red('exists:'), dir);
            }
        });
    });
}