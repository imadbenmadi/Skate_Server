const express = require("express");
const router = express.Router();
const refreshTokenController = require("../../Controllers/Auth/refreshTokenController");

router.post("/", refreshTokenController.handleRefreshToken);

module.exports = router;
