'use strict';

var chalk = require('chalk');
var mysqlPool = require('./mysqlPool');
var shell = require('shelljs');
var fs = require('fs'),
    path = require('path');

module.exports = function () {
	var configFile = shell.pwd()+ '/esb-config/default.js'
	//console.log(configFile);
	if(fs.existsSync(configFile)){
		var config = require(configFile);
		if(config.mysql !== undefined){
			var mysqlInstance = new mysqlPool(config.mysql);
			var pool = mysqlInstance.getPool();
		} else {
			console.log(chalk.red('mysql config is undefined'));
			process.exit(1);
		}

	} else {
		console.log(chalk.red('no config file'));
		process.exit(1);
	}

    return {
        startListener : function (listenerId) {
            var sql  = "SELECT * from `listeners` where";
            if (listenerId.match(/^[0-9]+$/)) {
                sql +=  " `id` = '" + listenerId + "'";
            } else {
                sql +=  " `active` = 'enabled'";
            }
	        
	        pool.getConnection(function(err, connection) {
                connection.query(sql, function(err, rows) {
                    if (err || !rows[0]) {
                        console.log('No listener found');
                        process.exit(1);
                    }

                    rows.forEach( function (row) {
                        var listener = shell.pwd() + '/exchange/' + row.exchange
                        + '/' + row.queue + '.js';

                        fs.stat(listener, function (err, stats) {
                            if (err) {
                                console.error(chalk.red('No listener file found:' + row.exchange
                                + '/'  + row.queue));
                            } else if (stats.isFile ()) {
                                if (row.active == 'disabled') {
                                    console.error(chalk.red('listener disabled : '),row.exchange
                                    + '/'  + row.queue);

                                } else {
	                                require(listener).start();
	                                console.log("Starting listener " + row.name);
                                }

                            }
                        });
                    });
                });
            });
        },
	    startCron : function (cronId) {
		    var sql  = "SELECT * from `cron` where";
		    if (cronId.match(/^[0-9]+$/)) {
			    sql +=  " `id` = '" + cronId + "'";
		    } else {
			    sql +=  " `active` = 1";
		    }
		    
		    pool.getConnection(function(err, connection) {
			    connection.query(sql, function(err, rows) {
				    if (err || !rows[0]) {
					    console.log('No cron job found');
					    process.exit(1);
				    }

				    rows.forEach( function (row) {
					    var cronjob = shell.pwd() + '/connector/cron/' + row.name + '.js';
					    fs.stat(cronjob, function (err, stats) {
						    if (err) {
							    console.error('No cron job file found:' + row.name + '.js');
						    } else if (stats.isFile ()) {
							    if (row.active == 0) {
								    console.error(chalk.red('cron job disabled : ') + row.name + '.js');
								    process.exit(1);
							    } else {
								    require(cronjob).run(row.pattern);
								    console.log(chalk.green("Starting cron job: ") + chalk.yellow(row.name));
							    }
						    }
					    });
				    });
			    });
		    });
		    
	    },
	    getConfig : function () {
		    var configFile = shell.pwd() + '/esb-config/default.js';
		    if(fs.existsSync(configFile)){
			    return require(configFile);
		    } else {
			    console.log(chalk.red('no config file'));
			    process.exit(1);
		    }
	    }
    }
};




