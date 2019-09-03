'use strict';

const amqp = require('amqplib');
const when = require('when');

const all = require('when').all;


function MessageBus(connections){
	this.connection = connections;
	this.conn = null;
	this.channel = null;
}

MessageBus.prototype.getConnection = function () {
    const that = this;
    const deferred = when.defer();
    amqp.connect(this.connection).then(function(conn) {
		that.conn = conn;
		deferred.resolve(conn);
	}, function(err){
		deferred.reject(err);
	});
	
	return deferred.promise;
};

MessageBus.prototype.getChannel = function () {
    const that = this;
    const deferred = when.defer();
    this.getConnection().then(function (conn) {
		process.once('SIGINT', function() { conn.close(); });
		if(that.channel !== null){
			deferred.resolve(that.channel);
		} else {
			conn.createChannel().then(function(ch){
				deferred.resolve(ch);
			});
		}

	}, function (err) {
		deferred.reject(err);
	});
	return deferred.promise;
};

MessageBus.prototype.checkExchange = function (exchange) {
	const deferred = when.defer();
	this.getChannel().then(function (ch) {
		ch.checkExchange(exchange).then(function (ok) {
			deferred.resolve(ok);
		}, function (err) {
			deferred.reject(err);
		});
	});

	return deferred.promise;
};

MessageBus.prototype.declareExchange = function (name, type, options) {
	const deferred = when.defer();
	options = options || {durable: false};
	type = type || 'topic';
	const that = this;
	this.getChannel().then(function (ch) {
		return ch.assertExchange(name, type, options).then(function (ok) {
			deferred.resolve(ok);
			ch.close();
		});

	}, function (err) {
		deferred.reject(err);
	});

	return deferred.promise;
};

MessageBus.prototype.send = function (ex, routingKey, msg) {
	routingKey = routingKey || '#';
	const that = this;
	this.getChannel().then(function (ch) {
		ch.publish(ex, routingKey, new Buffer(msg));
		return ch.close();
	}, function (err) {
		console.log(err.stack);
	}).ensure(function() {
		that.conn.close();
	});
};
/**
 * 监听队列
 * @param ex
 * @param queueName
 * @param routingKeys
 * @param options
 * @param processFunc
 */
MessageBus.prototype.listen = function (ex, queueName, routingKeys, options,  processFunc) {
	routingKeys = routingKeys || ['#'];
	options = options || {exclusive: true};
	const that = this;
	this.getChannel().then(function (ch) {
		that.channel = ch;
		let ok = ch.assertQueue(queueName, options);

		ok = ok.then(function(qok) {
			let queue = qok.queue;
			return all(routingKeys.map(function(rk) {
				ch.bindQueue(queue, ex, rk);
			})).then(function() { return queue; });
		});

		ok = ok.then(function(queue) {
			return ch.consume(queue, processFunc, {
				exclusive: false,
				noAck : false
			});
		});

		return ok.then(function() {
			console.log(queueName + " Listener start...");
		});
	}, function(err){
		console.log(err.stack);
	}).then(null, console.warn);
};

MessageBus.prototype.ack = function (msg) {
	this.channel.ack(msg);
};
/**
 * 解绑队列
 * @param queue
 * @param ex
 * @param routingKey
 */
MessageBus.prototype.unbindRoutingKey = function (queue, ex, routingKey) {
	const that = this;
	this.getChannel().then(function (ch) {
		return ch.unbindQueue(queue, ex, routingKey).then(function () {
			ch.close();
		});
	}, function (err) {
		console.log(err.stack);
	}).then(null, console.warn).ensure(function() {
		that.conn.close();
	});

};

module.exports = MessageBus;