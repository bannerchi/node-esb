#!/usr/bin/env node
'use strict';

const program = require('commander');
//TODO 加一个结构生成器 build 功能
program
	.version('0.0.1')
	.command('listen [id||all]', 'start a listener with listener Id')
	.command('cron [id||all]', 'start a cron job')
	.command('build [basedir]', 'Generate directory structure')
	.parse(process.argv);