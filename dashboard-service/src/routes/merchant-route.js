const express = require("express");

// const userController = require("../controller/internal-controller.js");
const checkUserRole = require("../middleware/merchant-checker.js");

const router = express.Router();

router.use(checkUserRole);

// router.get("/add-bank-details", userController.addBankDetails);

module.exports = router;
