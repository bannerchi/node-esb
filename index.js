#!/usr/bin/env node
"use strict";
var core = require('./lib/core');
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
	messageBus.send(exchange, rk, "topic", msg)
} else if(action == "listen"){
	var exchange = keys[1];
	var queue = keys[2];
	var rk = keys[3];
	var arr_rk = rk.split(',');
	console.log(arr_rk);
	messageBus.listen(exchange, queue, "topic", arr_rk, {}, function(msg){
		var res = JSON.parse(msg.content.toString());
		console.log(res.dd);
	});
} else {
	console.log("wrong action");
}



