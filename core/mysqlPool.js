'use strict';
var mysql = require('mysql');
var _ = require('lodash');

function MysqlPool(config){
	var defaultConfig = {
		host : "127.0.0.1",
		user : "root",
		password : "",
		port : 3306,
		database : "node-esb"
	};
    this.pool = null;
    this.config = _.extend(defaultConfig, config);
}

MysqlPool.prototype.getPool = function () {
    if(this.pool === null){
        this.pool = mysql.createPool(this.config);
    }
    return this.pool
};

module.exports = MysqlPool;