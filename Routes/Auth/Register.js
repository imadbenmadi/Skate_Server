const express = require("express");
const router = express.Router();
const RegisterController = require("../../Controllers/Auth/RegisterController");

router.post("/", async (req, res) => {
    RegisterController.handleRegister(req, res);
});

module.exports = router;
