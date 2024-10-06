const express = require("express");

const userController = require("../controller/user-controller.js");
const verifyToken = require("../middleware.js/auth-middleware.js");

const router = express.Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/refresh", userController.refreshToken);
router.get("/logout", userController.logout);

router.get("/hello", verifyToken, (req, res) => {
  res.json({ msg: "hello user ", user: req.user });
});

module.exports = router;
