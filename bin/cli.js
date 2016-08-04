#!/usr/bin/env node
'use strict';

var program = require('commander');
//TODO 加一个结构生成器 build 功能
program
	.version('0.0.1')
	.command('listen [id]', 'start a listener with listener Id')
	.parse(process.argv);