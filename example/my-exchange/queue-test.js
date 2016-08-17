'use strict';

var util = require('util');
var Listener = require('../../core/listener');
var Payload = require('../../core/payload');
var when = require('when');
//TODO Change this class name as you want
function QueueTestListener() {}

function run(msg) {
	var deferred = when.defer();
	try{
		var res = JSON.parse(msg.content.toString());
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
	var listener = new Listener(run, 'amqp://localhost');
	
	listener.listen(
		Payload.getExchange(__dirname, 'topic'),
		Payload.getQueue(__dirname, __filename),
		Payload.getRoutingKey()
	);
};

module.exports = new QueueTestListener();




