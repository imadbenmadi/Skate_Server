const express = require("express");
const router = express.Router();
const verifyController = require("../../Controllers/Auth/verifyController");
router.post("/", verifyController.handleVirefy);

module.exports = router;
