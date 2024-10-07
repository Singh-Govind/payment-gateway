const injectLoggedFlag = (req, res, next) => {
  req.headers["x-is-logged"] = req.isLogged ? "true" : "false";

  if (req.isLogged) {
    req.headers["x-user"] = JSON.stringify(req.user);
  }
  next();
};

module.exports = injectLoggedFlag;
