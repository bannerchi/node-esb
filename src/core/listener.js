'use strict';
const MessageBus = require('../lib/messagebus');
const _ = require('lodash');
const ERROR_QUEUE = 'error_queue'

function Listener(processFunc, connection) {
	this.messagebus = new MessageBus(connection);
	// must be a promise
	this.processFunction = processFunc;
}

Listener.prototype.listen = function (exchange, queue, routingKey) {
	this.messagebus.declareExchange(
		exchange.name,
		exchange.type,
		exchange.option)
		.then((ok) =>  {
		this.messagebus.listen(
			exchange.name,
			queue.name,
			routingKey,
			queue.option,
			this._process.bind(this));
	}, (e) => {
		if (e) {
			console.log(`Error occur when listen , ${e.message}`);
		}
	});

};

Listener.prototype._errorHandler = function (e, msg) {
	this.send(ERROR_QUEUE, '#', msg)
};

Listener.prototype._process = function (msg) {
	this.processFunction(msg).then((ok) => {
		console.log('处理函数返回结果ok', ok);
	}, (err) => {
		this._errorHandler(err, msg)
		console.log(err.message);
	});
	this.messagebus.ack(msg);
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

Listener.prototype.unBinding = function (queue, ex, routingKey) {
	this.messagebus.toggleBindQueue(queue, ex, routingKey, false)
}

Listener.prototype.binding = function (queue, ex, routingKey) {
    this.messagebus.toggleBindQueue(queue, ex, routingKey)
}

module.exports = Listener;
