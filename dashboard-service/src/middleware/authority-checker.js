const { FORBIDDEN_ERROR } = require("../constants/error-constants");
const { STATUS_FORBIDDEN } = require("../constants/status-codes");

const authorityChecker = (req, res, next) => {
    const user = req.user;
  
    if (!user) {
      const error = new Error("User is not authorized!");
      error.name = FORBIDDEN_ERROR;
      error.status = STATUS_FORBIDDEN;
      throw error;
    }
  
    if (user.role !== "admin" && user.role !== "manager" && user.role !== "developer") {
      const error = new Error("User don't have permission!");
      error.name = FORBIDDEN_ERROR;
      error.status = STATUS_FORBIDDEN;
      throw error;
    }
  
    next();
  };
  
  module.exports = authorityChecker;
  