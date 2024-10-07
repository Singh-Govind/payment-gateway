const { User } = require("../../models");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "info", 
  format: combine(
    colorize(),
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console(), 
    new transports.File({ filename: "logs/message-consumer.log", level: "error" }), 
  ],
});

const updateUserToMerchant = async (userDetails) => {
  try {
    await User.update(
      {
        merchantId: userDetails.merchantId,
        role: "merchant",
      },
      {
        where: {
          userId: userDetails.userId,
        },
      }
    );
  } catch (e) {
    logger.error(`Message: ${e.message}\n Stack: ${e.stack}\n`);
    console.log("something went wrong while making merchant", e.message);
  }
};

module.exports = { updateUserToMerchant }