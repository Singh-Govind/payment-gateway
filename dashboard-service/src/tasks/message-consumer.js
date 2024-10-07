const { consumer } = require("../../config/kafka");
const merchantMaker = require("../controller/merchant-queue-controller");

async function makeMerchant() {
  await consumer.connect();
  await consumer.subscribe({ topic: "make_merchant", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      //   console.log(`Received message: ${message.value}`);
      merchantMaker(message.value);
    },
  });
}

makeMerchant();
