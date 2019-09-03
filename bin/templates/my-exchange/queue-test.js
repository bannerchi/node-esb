'use strict';

const util = require('util');
const Listener = require('node-esb').listener;
const Payload = require('node-esb').payload;
const when = require('when');
//TODO Change this class name as you want
function QueueTestListener() {}

function run(msg) {
	const deferred = when.defer();
	try{
		const res = JSON.parse(msg.content.toString());
		deferred.resolve(res);
	} catch(e){
		deferred.reject(e);
	}
	return deferred.promise;
}
/*
  you can set connection into config file
  ex : amqp://localhost:55555 or
  {
    protocol: 'amqp',
    host:'',
    port:'',
    username:'',
    password:''
  }
 */
QueueTestListener.prototype.start = function () {
	const listener = new Listener(run, 'amqp://localhost');
	
	listener.listen(
		Payload.getExchange(__dirname, 'topic'),
		Payload.getQueue(__dirname, __filename),
		Payload.getRoutingKey() //default is ["#"] maybe you should make this yourself
	);
};

module.exports = new QueueTestListener();




