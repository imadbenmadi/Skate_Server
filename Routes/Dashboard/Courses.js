const express = require("express");
const router = express.Router();
const CoursesController = require("../../controllers/Dashboard/CoursesController");

router.post("/", CoursesController.handle_add_Courses);

module.exports = router;
