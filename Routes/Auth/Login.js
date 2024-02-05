const express = require("express");
const router = express.Router();
require("dotenv").config();
const LoginController = require("../../Controllers/Auth/LoginController");
router.post("/", LoginController.handleLogin);
module.exports = router;
