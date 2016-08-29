/**
 * make you own config here
 */
module.exports = {
	exchange : {
		option : {
			durable : true,
			internal : false,
			autoDelete : false
		}
	},
	queue : {
		option : {
			durable: true,
			exclusive: false,
			autoDelete: false
		}
	},
	amqp : {
		connection : 'amqp://localhost'
	},
	mysql : {
		host : "127.0.0.1",
		user : "root",
		password : "",
		port : 3306,
		database : "node-esb"
	}
};