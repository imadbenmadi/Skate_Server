const express = require("express");
const router = express.Router();
const logoutController = require("../Controllers/LogoutController");

router.get("/", logoutController.handleLogout);

module.exports = router;
