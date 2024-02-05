const express = require("express");
const router = express.Router();
const RegisterController = require("../../Controllers/Auth/RegisterController");
router.post("/", RegisterController.handleRegister);

module.exports = router;
