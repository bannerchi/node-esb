#!/usr/bin/env node
var chalk = require('chalk');
var program = require('commander');
var shell = require('shelljs');
var fs = require('fs');
var path = require('path');

program
    .option('-c, --cron [name]', 'create cron dir')
    .option('-e, --exchange [name]', 'create exchange dir')
    .parse(process.argv);


if (program.cron) {
    mkDir('./connector/' + program.cron);
} else if (program.exchange) {
    mkDir('./exchange/' + program.exchange);
} else {
    var dirs = ['exchange','connector'];
    buildDirs(dirs, baseDir);
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
    console.log(chalk.cyan('create:'), path);
    if (fn) fn();
}

function buildDirs(dirs, baseDir) {
    baseDir = baseDir || './';
    dirs.forEach( function (dir) {
        fs.stat(baseDir + '/' +  dir, function (err, stats) {
            if (err) {
                mkDir(dir);
            } else if (stats.isDirectory ()) {
                console.error(chalk.red('exists:'), dir);
            }
        });
    });
}