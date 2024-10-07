const dataExtracter = (req, res, next) => {
  req.isLogged = req.headers["x-is-logged"] === "true";

  if (req.isLogged) {
    req.user = JSON.parse(req.headers["x-user"]);
  }
  next();
};

module.exports = dataExtracter;
