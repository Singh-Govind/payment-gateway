const { MerchantDetails } = require("../../../models");
const { INTERNAL_SERVER_ERROR } = require("../../constants/error-constants");
const {
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../../constants/status-codes");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), customFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/message-consumer.log",
      level: "error",
    }),
  ],
});

// helper functions
function merchantIdGenerator() {
  let str = "MERCH_";
  return str + Math.floor(Math.random() * 99999);
}

const merchantMaker = async (userId) => {
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

      merchantId = merchantIdGenerator();
      const mer = await MerchantDetails.findOne({ where: { merchantId } });

      if (!mer) {
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
      userId: userId,
      merchantId,
      isActive: false,
      kyc: false,
    });
  } catch (e) {
    logger.error(`Message: ${e.message}\n Stack: ${e.stack}\n`);
    console.log("somthing went wrong", e.message);
  }
};

module.exports = merchantMaker;
