const { Kafka } = require("kafkajs");

const kafkaCon = new Kafka({
  clientId: "merchant-maker",
  brokers: ["localhost:9092"],
});

const producer = kafkaCon.producer();

// const consumer = kafka.consumer({ groupId: 'merchant-group' });

module.exports = {
  producer,
  // consumer,
  kafkaCon,
};
