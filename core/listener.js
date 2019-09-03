'use strict';
const MessageBus = require('../lib/messagebus');
const path = require('path');
const _ = require('lodash');
const when = require('when');
const Errors = require('./error');
const payload = require('./payload');

function Listener(processFunc, connection) {
	this.messagebus = new MessageBus(connection);
	// must be a promise
	this.processFunction = processFunc;
}

Listener.prototype.listen = function (exchange, queue, routingKey) {
	const that = this;
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
	const that = this;
	this.processFunction(msg).then(function (ok) {
		console.log(ok);

	}, function(err){
		//TODO error handler
		console.log(err.message);
	});
	that.messagebus.ack(msg);
};
/**
 * send msg to listener msg must be string
 * msg json such as '{"dd":"ok"}' will get a good json object in process function
 * @param exchange
 * @param routingKey
 * @param msg
 */
Listener.prototype.send = function (exchange, routingKey, msg) {
	if(_.isString(msg)){
		this.messagebus.send(exchange, routingKey, msg);
	} else {
		console.log('msg must be string');
		process.exit(1);
	}
};

module.exports = Listener;
