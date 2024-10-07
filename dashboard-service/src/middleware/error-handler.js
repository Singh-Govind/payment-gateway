const { VALIDATION_ERROR, NOT_FOUND_ERROR, UNAUTHORIZED_ERROR, FORBIDDEN_ERROR } = require("../constants/error-constants");
const { STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR, STATUS_NOT_FOUND, STATUS_UNAUTHORIZED, STATUS_FORBIDDEN } = require("../constants/status-codes");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  logger.error(`Status: ${STATUS_BAD_REQUEST}, Message: ${err.message}\n Stack: ${err.stack}\n`);

  if (err.name === VALIDATION_ERROR) {
    return res.status(STATUS_BAD_REQUEST).json({ msg: err.message, status: STATUS_BAD_REQUEST });
  }

  if (err.name === NOT_FOUND_ERROR) {
    return res.status(STATUS_NOT_FOUND).json({ msg: err.message, status: STATUS_NOT_FOUND });
  }

  if (err.name === UNAUTHORIZED_ERROR) {
    return res.status(STATUS_UNAUTHORIZED).json({ msg: err.message, status: STATUS_UNAUTHORIZED });
  }

  if (err.name === FORBIDDEN_ERROR) {
    return res.status(STATUS_FORBIDDEN).json({ msg: err.message, status: STATUS_FORBIDDEN });
  }

  if (err.message === "jwt expired") {
    return res.status(STATUS_FORBIDDEN).json({ msg: err.message, status: STATUS_FORBIDDEN });
  }

  // For other types of errors, default to 500
  res.status(STATUS_INTERNAL_SERVER_ERROR).json({
    msg: "INTERNAL SERVER ERROR",
    status: STATUS_INTERNAL_SERVER_ERROR,
  });
};

module.exports = errorHandler;
