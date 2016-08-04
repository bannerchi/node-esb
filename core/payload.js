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
