'use strict';

var amqp = require('amqplib');
var when = require('when');

var all = require('when').all;


function MessageBus(connections){
	this.connection = connections;
	this.conn = null;
	this.channel = null;
}

MessageBus.prototype.getConnection = function () {
	var that = this;
	var deferred = when.defer();
	amqp.connect(this.connection).then(function(conn) {
		that.conn = conn;
		deferred.resolve(conn);
	}, function(err){
		deferred.reject(err);
	});
	
	return deferred.promise;
};

MessageBus.prototype.getChannel = function () {
	var that = this;
	var deferred = when.defer();
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
	var deferred = when.defer();
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
	var deferred = when.defer();
	options = options || {durable: false};
	type = type || 'topic';
	var that = this;
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
	var that = this;
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
 * 
 * @param ex
 * @param queue
 * @param type
 * @param routingKeys
 * @param processFunc
 */
MessageBus.prototype.listen = function (ex, queueName, routingKeys, options,  processFunc) {
	routingKeys = routingKeys || ['#'];
	options = options || {exclusive: true};
	var that = this;
	this.getChannel().then(function (ch) {
		that.channel = ch;
		var ok = ch.assertQueue(queueName, options);

		ok = ok.then(function(qok) {
			var queue = qok.queue;
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

MessageBus.prototype.unbindRoutingKey = function (queue, ex, routingKey) {
	var that = this;
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