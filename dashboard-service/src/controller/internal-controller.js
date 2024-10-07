const { producer } = require("../../config/kafka");
const { MerchantDetails } = require("../../models");

// helper functions
const {
  VALIDATION_ERROR,
  STATUS_BAD_REQUEST,
} = require("../constants/error-constants");
const { STATUS_OK } = require("../constants/status-codes");

// main functions
const registerMerchant = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      const error = new Error("userId required");
      error.name = VALIDATION_ERROR;
      error.status = STATUS_BAD_REQUEST;
      throw error;
    }

    const merchant = await MerchantDetails.findOne({ where: { userId } });

    if (!merchant) {
      // TODO: something needs to be done
    }

    await MerchantDetails.update(
      {
        isActive: true,
        kyc: true,
      },
      {
        where: {
          merchantId: merchant.merchantId,
        },
      }
    );

    // TODO: send message to user-service to make user merchant
    await producer.connect();
    await producer.send({
      topic: "merchant_request_accepted",
      messages: [
        { value: JSON.stringify({ userId, merchantId: merchant.merchantId }) },
      ],
    });
    await producer.disconnect();

    res.status(STATUS_OK).json({
      msg: "merchant registered!",
      merchant,
      status: STATUS_OK,
    });
  } catch (e) {
    next(e);
  }
};

const getMerchantRequest = async (req, res, next) => {
  try {
    const merchantsRequests = await MerchantDetails.findAll({
      where: {
        isActive: false,
      },
    });

    res.status(STATUS_OK).json({
      msg: "merchant requests!",
      merchantsRequests,
      status: STATUS_OK,
    });
  } catch (e) {
    return res.status(500).json({ err: e.message });
    next(e);
  }
};

module.exports = { registerMerchant, getMerchantRequest };
