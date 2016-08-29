'use strict';

var _ = require('lodash');
var path = require('path');

function Payload() {}

Payload.prototype.getExchange = function (dirName, type, exchangeOption) {
	var defaultConfig = {
		durable : true,
		internal : false,
		autoDelete : false
	};
  	exchangeOption = _.extend(defaultConfig, exchangeOption);
	return {
		name : path.basename(dirName),
		option : exchangeOption,
		type: type
	}
};

Payload.prototype.getQueue = function (dirName, fileName, queueOption) {
	dirName = path.basename(dirName);
	fileName = path.basename(fileName, '.js');
	var defaultConfig = {
		durable: true,
		exclusive: false,
		autoDelete: false
	};
    queueOption = _.extend(defaultConfig, queueOption);
	return {
		name : dirName + "/" + fileName,
		option : queueOption
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
