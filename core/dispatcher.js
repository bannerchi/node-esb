'use strict';

var chalk = require('chalk');
var mysqlPool = require('./mysqlPool').getPool();
var fs = require('fs'),
    path = require('path');

module.exports = function () {
    return {
        startListener : function (listenerId) {
            var sql  = "SELECT * from `listeners` where";
            if (listenerId.toString().match(/^[0-9]+$/)) {
                sql +=  " `id` = '" + listenerId + "'";
            } else {
                sql +=  " `active` = 'enabled'";
            }

            mysqlPool.getConnection(function(err, connection) {
                connection.query(sql, function(err, rows) {
                    if (err || !rows[0]) {
                        console.log('No listener found');
                        process.exit(1);
                    }

                    rows.forEach( function (row) {
                        var listener = path.join(__dirname, '../exchange/' + row.exchange
                        + '/' + row.queue + '.js');

                        fs.stat(listener, function (err, stats) {
                            if (err) {
                                console.error('No listener file found:' + row.exchange
                                + '/'  + row.queue);
                                process.exit(1);
                            } else if (stats.isFile ()) {
                                if (row.active == 'disabled') {
                                    console.error(chalk.red('listener disabled : '),row.exchange
                                    + '/'  + row.queue);
                                    process.exit(1);
                                }
                                require(listener).start();
                                console.log("Starting listener " + row.name);
                            }
                        });
                    });
                });
            });
        }
    }
};




