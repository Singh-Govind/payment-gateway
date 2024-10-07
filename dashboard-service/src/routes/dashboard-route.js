const express = require("express");

const internalController = require("../controller/internal-controller.js");
const authorityChecker = require("../middleware/authority-checker.js");

const router = express.Router();

router.use(authorityChecker);

router.get("/get-merchant-request", internalController.getMerchantRequest);
router.post("/create-merchant", internalController.registerMerchant);

module.exports = router;
