const express = require("express");
const router = express.Router();
const CoursesController = require("../Controllers/CoursesController");
router.get("/", CoursesController.getAllCourses);
router.get("/:id", CoursesController.get_course_ById);
router.get("/userCourses/:id", CoursesController.get_courses_By_user_Id);

module.exports = router;
