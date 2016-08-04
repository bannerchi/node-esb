'use strict';

var config = require('config');
var _ = require('lodash');
var path = require('path');

function Payload() {}

Payload.prototype.getExchange = function (dirName, type) {
	return {
		name : path.basename(dirName),
		option : config.exchange.option,
		type: type
	}
};

Payload.prototype.getQueue = function (dirName, fileName) {
	dirName = path.basename(dirName);
	fileName = path.basename(fileName, '.js');
	
	return {
		name : dirName + "/" + fileName,
		option : config.queue.option
	}	
};
/**
 * maybe get from DB
 * @returns {string[]}
 */
Payload.prototype.getRoutingKey = function (){
	return ["#"];
};

/**
 * set data when you want to send
 * @param input
 * @returns {string}
 */
Payload.prototype.setData = function (input) {
	var output = '';
	if(_.isArray(input) || _.isObject(input)){
		output = JSON.stringify(input);
	} else if(_.isString(input)){
		output = input;
	}

	return output;
};

module.exports = new Payload();
