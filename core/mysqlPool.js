'use strict';

var config = require('config');
var mysql = require('mysql');
var pool = undefined;

module.exports.getPool  = function(){
    if (pool == undefined){
        pool = mysql.createPool({
            host     : config.mysql.host,
            user     : config.mysql.user,
            password : config.mysql.pwd,
            port     : config.mysql.port,
            database : config.mysql.database
        });
    }
    return pool;
};