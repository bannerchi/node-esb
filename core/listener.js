'use strict';
var MessageBus = require('../lib/messagebus');
var path = require('path');
var config = require('config');
var _ = require('lodash');
var when = require('when');
var Errors = require('./error');
var payload = require('./payload');

function Listener(processFunc) {
	this.messagebus = new MessageBus(config.amqp.connection);
	// must be a promise
	this.processFunction = processFunc;
}

Listener.prototype.listen = function (exchange, queue, routingKey) {
	var that = this;
	this.messagebus.declareExchange(
		exchange.name,
		exchange.type,
		exchange.option)
		.then(function (ok) {
		that.messagebus.listen(
			exchange.name,
			queue.name,
			routingKey,
			queue.option,
			that._process.bind(that));
	}, function(e){
		console.log(e.message);
	});

};

Listener.prototype._process = function (msg) {
	var that = this;
	this.processFunction(msg).then(function (ok) {
		console.log(ok);

	}, function(err){
		//TODO error handler
		console.log(err.message);
	});
	that.messagebus.ack(msg);
};


module.exports = Listener;
