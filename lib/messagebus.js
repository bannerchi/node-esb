'use strict';

var amqp = require('amqplib');
var when = require('when');
var all = require('when').all;


function MessageBus(connections){
	this.connection = connections;
}

MessageBus.prototype.send = function (ex, routingKey, type, msg) {
	type = type || 'topic';
	routingKey = routingKey || '*';
	amqp.connect(this.connection).then(function(conn) {
		return when(conn.createChannel().then(function(ch) {
			var ok = ch.assertExchange(ex, type, {durable: false});
			return ok.then(function() {
				ch.publish(ex, routingKey, new Buffer(msg));
				console.log(" [x] Sent %s:'%s'", routingKey, msg);
				return ch.close();
			});
		})).ensure(function() { conn.close(); })
	}).then(null, console.log);
};
/**
 * 
 * @param ex
 * @param queue
 * @param type
 * @param routingKeys
 * @param processFunc
 */
MessageBus.prototype.listen = function (ex, queue, type, routingKeys, options,  processFunc) {
	routingKeys = routingKeys || '#';
	options.exchange = options.exchange || {durable: false};
	options.queue = options.queue || {exclusive: true};
	amqp.connect(this.connection).then(function(conn) {
		process.once('SIGINT', function() { conn.close(); });
		return conn.createChannel().then(function(ch) {

			var ok = ch.assertExchange(ex, type, options.exchange);

			ok = ok.then(function() {
				return ch.assertQueue(queue, options.queue);
			});

			ok = ok.then(function(qok) {
				var queue = qok.queue;
				return all(routingKeys.map(function(rk) {
					ch.bindQueue(queue, ex, rk);
				})).then(function() { return queue; });
			});

			ok = ok.then(function(queue) {
				return ch.consume(queue, processFunc, {noAck: true});
			});

			return ok.then(function() {
				console.log("Listener start...");
			});

		});
	}).then(null, function(err){
		console.log(err);
	});
};


module.exports = MessageBus;