
module.exports = {
	exchange : {
		option : {
			durable : true,
			internal : false,
			autoDelete : false
		}
	},
	amqp : {
		connection : 'amqp://localhost'
	}
};