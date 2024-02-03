const express = require("express");
const router = express.Router();
const logoutController = require("../Controllers/LogoutController");

router.post("/", logoutController.handleLogout);

module.exports = router;
