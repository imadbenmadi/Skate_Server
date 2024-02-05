const express = require("express");
const router = express.Router();
const CoursesController = require("../../Controllers/Dashboard/LoginController");

router.post("/", Admin_LogiController.handle_Login);

module.exports = router;
