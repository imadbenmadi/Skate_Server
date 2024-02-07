const express = require("express");
const router = express.Router();
require("dotenv").config();
const LoginController = require("../../Controllers/Auth/LoginController");

let loginAttempts = {};
router.post("/", (req, res) => {
    const ipAddress = req.ip;

    if (!loginAttempts[ipAddress]) {
        loginAttempts[ipAddress] = 1;
    } else {
        loginAttempts[ipAddress]++;
    }

    if (loginAttempts[ipAddress] > 5) {
        return res
            .status(429)
            .json({ error: "Too many login attempts. Try again later." });
    }
    LoginController.handleLogin(req, res);
    loginAttempts[ipAddress] = 0;
});
module.exports = router;
