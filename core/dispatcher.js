/**
 TODO 调度器
 dispatcher for listener
 listenerId = 1  listener
 1. mysql
 2. f1 = base path + exchange name  ex: ../connectors/myExchange
 3. var allQueue = require('require-dir')(f1); //判断dir 是否存在, 是否有文件
 var listener = allQueue[listener['name']];
 exports.startListener = function(){};
 基础 ： ./connectors
 ../myExchange
 .../myQueue1.js
 .../myQueue2.js
 .../myQueue3.js
 */
