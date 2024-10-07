const { MerchantDetails } = require("../../../models");
const { INTERNAL_SERVER_ERROR } = require("../../constants/error-constants");
const {
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../../constants/status-codes");

const merchantIdGenerator = (name) => {
  const number = Math.floor(Math.random() * 999999);

  return (name.split("").slice(0, 5).join("").trim() + "_" + number).toUpperCase();
};

const merchantMaker = async (user) => {
  try {
    let count = 0;
    let merchantId = undefined;

    while (true) {
      if (count > 30) {
        const error = new Error("went wrong in merchant Id!");
        error.name = INTERNAL_SERVER_ERROR;
        error.status = STATUS_INTERNAL_SERVER_ERROR;
        throw error;
      }

      merchantId = merchantIdGenerator(user.firstName);

      let merchant = await MerchantDetails.findOne({ where: { merchantId } });

      if (!merchant) {
        break;
      }

      count++;
    }

    if (!merchantId) {
      const error = new Error("went wrong in merchant Id!");
      error.name = INTERNAL_SERVER_ERROR;
      error.status = STATUS_INTERNAL_SERVER_ERROR;
      throw error;
    }

    await MerchantDetails.create({
      userId: user.userId,
      merchantId,
      isActive: false,
      kyc: false,
    });

  } catch (e) {
    console.log("somthing went wrong", e.message);
  }
};

module.exports = merchantMaker;
