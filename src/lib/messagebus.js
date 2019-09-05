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
    const deferred = when.defer();
    amqp.connect(this.connection).then((conn) => {
		this.conn = conn;
		deferred.resolve(conn);
	}, function(err){
		deferred.reject(err);
	});
	
	return deferred.promise;
};

MessageBus.prototype.getChannel = function () {
    const deferred = when.defer();
    this.getConnection().then((conn) => {
		process.once('SIGINT', function() { conn.close(); });
		if(this.channel !== null){
			deferred.resolve(this.channel);
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
	this.getChannel().then((ch) => {
		ch.publish(ex, routingKey, new Buffer(msg));
		return ch.close();
	}, function (err) {
		console.log('send msg error:', err.stack);
	}).ensure(() => {
		this.conn.close();
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
	this.getChannel().then((ch) => {
		this.channel = ch;
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
		// TODO add to error queue
	}).then(null, console.warn);
};

MessageBus.prototype.ack = function (msg) {
	this.channel.ack(msg);
};
/**
 * 处理队列的绑定解绑
 * @param queue
 * @param ex
 * @param routingKey
 * @param isBind
 */
MessageBus.prototype.toggleBindQueue = function (queue, ex, routingKey, isBind = true) {
	this.getChannel().then(function (ch) {
		if (!isBind) {
            return ch.unbindQueue(queue, ex, routingKey).then(function () {
            	console.log(`unbind queue:${queue} ex:${ex} routingKey: ${routingKey}`)
                ch.close();
            });
		} else {
            return ch.bindQueue(queue, ex, routingKey).then(function () {
                console.log(`bind queue:${queue} ex:${ex} routingKey: ${routingKey}`)
                ch.close();
            });
		}
	}, function (err) {
		console.log('toggleBindQueue error:', err.stack);
	}).then(null, console.warn).ensure(() => {
		this.conn.close();
	});

};

module.exports = MessageBus;