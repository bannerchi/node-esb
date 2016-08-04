#!/usr/bin/env node
'use strict';

var program = require('commander');

program
	.version('0.0.1')
	.command('listen [id]', 'start a listener with listener Id')
	.parse(process.argv);