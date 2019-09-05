#!/usr/bin/env node
'use strict';

const program = require('commander');
//TODO 加一个结构生成器 build 功能
program
	.version('0.0.2')
	.command('build [basedir]', 'Generate directory structure')
	.parse(process.argv);