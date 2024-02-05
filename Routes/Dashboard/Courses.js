const express = require("express");
const router = express.Router();
const CoursesController = require("../../controllers/Dashboard/CoursesController");
// const Verify_Admin = require("./../../Middleware/Verify_Admin ");
router.post("/", CoursesController.handle_add_Courses);

module.exports = router;
