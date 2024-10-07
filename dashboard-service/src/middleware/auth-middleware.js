const { STATUS_UNAUTHORIZED } = require("../constants/status-codes");

const authChecker = (req, res, next) => {
  if (!req.isLogged) {
    return res
      .status(STATUS_UNAUTHORIZED)
      .json({ msg: "not authorized", status: STATUS_UNAUTHORIZED });
  }
  next();
};

module.exports = authChecker;
