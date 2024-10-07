const checkUserRole = (req, res, next) => {
  const user = req.user;

  if (!user) {
    const error = new Error("User is not authorized!");
    error.name = FORBIDDEN_ERROR;
    error.status = STATUS_FORBIDDEN;
    throw error;
  }

  if (user.role !== "merchant") {
    const error = new Error("User is don't have permission!");
    error.name = FORBIDDEN_ERROR;
    error.status = STATUS_FORBIDDEN;
    throw error;
  }

  next();
};

module.exports = checkUserRole;
