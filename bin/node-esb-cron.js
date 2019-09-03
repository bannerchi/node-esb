#!/usr/bin/env node
const chalk = require('chalk');
const program = require('commander');
const daemon = require('../lib/daemon');
program
	.option('-t, --test', 'just test')
	.option('-d, --daemon', 'start as daemon')
	.option('-s, --stop', 'stop daemon cron')
	.parse(process.argv);

const cronJobId = program.args;

 if (!cronJobId.length) {
 	console.error(chalk.red('cronJobId required'));
 	process.exit(1);
 } else if (cronJobId.toString().match(/[^0-9||all]/)) {
	 console.error(chalk.red('cronJobId can only be numbers or all'));
	 process.exit(1);
 }


if(program.test){
	const f1 = './templates/cronjob';
	const allQueue = require('require-dir')(f1);
	const cornJob = allQueue['cron-test'];
	cornJob.run('*/2 * * * * *');
} else if(program.daemon){
	daemon.start('cron-id-' + cronJobId,
		'./bin/interface.js',
		['cron', 'start', cronJobId],
		null,
		function (process) {
			console.log(chalk.green('Start Cron id:' + cronJobId + ' as a daemon ,just run ') +
				chalk.yellow('./node_modules/pm2/bin/pm2 ls') +
				chalk.green(' to see them'));
		}
	);
} else if(program.stop){
	daemon.stop('cron-id-' + cronJobId, function(){})
} else{
	require('../core/dispatcher')().startCron(cronJobId.toString());
}


