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
	}
};