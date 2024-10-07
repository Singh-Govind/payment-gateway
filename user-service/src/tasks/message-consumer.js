const { kafkaCon } = require("../../config/kafka");
const { updateUserToMerchant } = require("../controller/background-tasks");

async function makeMerchant() {
  const consumer = await kafkaCon.consumer({ groupId: "merchantA" });
  await consumer.connect();
  await consumer.subscribe({
    topic: "merchant_request_accepted",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      // console.log(`Received message: ${message.value}`);
      updateUserToMerchant(JSON.parse(message.value.toString()));
    },
  });
}

makeMerchant();
