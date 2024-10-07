const { Kafka } = require('kafkajs');


const kafka = new Kafka({
  clientId: 'merchant-maker',
  brokers: ['localhost:9092'],
});


const producer = kafka.producer();


const consumer = kafka.consumer({ groupId: 'merchant-group' });

module.exports = { producer, consumer };
