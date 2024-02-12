const express = require("express");
const router = express.Router();
const CoursesController = require("../Controllers/CoursesController");
router.get("/", CoursesController.getAllCourses);
router.get("/userCourses/:_id", CoursesController.get_courses_By_user_Id);
router.get("/:id", CoursesController.get_course_ById);

router.post("/request", CoursesController.handle_request_Course);
module.exports = router;
