'use strict';
const mysql = require('mysql');
const _ = require('lodash');

function MysqlPool(config){
	const defaultConfig = {
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