const express = require("express");

const authMiddleware = require("../middleware.js/auth-middleware.js")

const userController = require("../controller/user-controller.js");
const verifyToken = require("../middleware.js/auth-middleware.js");

const router = express.Router(authMiddleware);

router.post("/login", userController.login);
router.post("/register", userController.register);


router.get("/refresh", userController.refreshToken);
router.get("/logout", userController.logout);

router.use(authMiddleware);
router.get("/make-merchant-request", userController.requestForMerchant);
router.get("/hello", verifyToken, (req, res) => {
  res.json({ msg: "hello user ", user: req.user });
});

module.exports = router;
