#!/usr/bin/env node
"use strict";
var core = require('./lib/messagebus');
var daemon = require('./lib/daemon');
var messageBus = new core("amqp://localhost");
var keys = process.argv.slice(2);
console.log(keys);
if (keys.length < 1) {
	
	process.exit(1);
}

var action = keys[0];




if(action == "send"){
	var exchange = keys[1];
	var msg = keys[3];
	var rk = keys[2];
	messageBus.send(exchange, rk, msg)
} else if(action == "listen"){
	var exchange = keys[1];
	var queue = keys[2];
	var rk = keys[3];
	var arr_rk = [];
	if (!rk){
		arr_rk = null;
	} else {
		arr_rk = rk.split(',');
	}

	messageBus.listen(exchange, queue, arr_rk, {
		durable: true,
		exclusive: false,
		autoDelete: false
	}, function(msg){

		messageBus.ack(msg);
		var res = JSON.parse(msg.content.toString());
		console.log(res);
	});
} else if(action == 'exchange'){
	var exchange = keys[1];

	messageBus.declareExchange(exchange, null, {
		durable : true,
		internal : false,
		autoDelete : false
	});
} else if (action == 'unbind'){
	var exchange = keys[1];
	var queue = keys[2];
	var rk = keys[3];

	messageBus.unbindRoutingKey(queue, exchange, rk);
} else if(action == 'daemon-start'){
	var name = keys[1];
	daemon.start(name, 'index.js', ['listen', 'test-exchange', 'test-queue-2', 'test-rk'],null, function(process){
		console.log(process);
	});

} else if(action == 'daemon-stop') {
	var name = keys[1];
	daemon.stop(name, function (apps) {
		
	});
} else if(action == 'daemon-delete'){
	var name = keys[1];
	daemon.delete(name, function (apps) {

	});
} else if(action == 'daemon-restart'){
	var name = keys[1];
	daemon.restart(name, function (apps) {

	});
} else if(action == 'daemon-desc'){
	var name = keys[1];
	daemon.desc(name, function (apps) {
		console.log(apps);
	});
} else {
	console.log("wrong action");
}



