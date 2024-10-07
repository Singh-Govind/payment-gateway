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

    // TODO: send message to user-service to make user merchant
    await producer.connect();
    await producer.send({
      topic: "merchant_request_accepted",
      messages: [{ value: req.user }],
    });
    await producer.disconnect();

    res.status(STATUS_OK).json({
      msg: "requested to make user merchant!",
      status: STATUS_OK,
    });
  } catch (e) {
    next(e);
  }
};

const getMerchantRequest = async (req, res, next) => {
  try {
    const merchantsRequests = await MerchantDetails.findAll({
      where: { isActive: false },
    });

    res.status(STATUS_OK).json({
      msg: "requested to make user merchant!",
      merchantsRequests,
      status: STATUS_OK,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { registerMerchant, getMerchantRequest };
