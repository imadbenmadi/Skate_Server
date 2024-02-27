const express = require("express");
const router = express.Router();
const CoursesController = require("../../Controllers/Dashboard/CoursesController");
router.post("/", CoursesController.handle_add_Courses);
router.delete("/", CoursesController.handle_delete_Courses);
router.put("/", CoursesController.handle_update_Courses);

router.post(
    "/Accept_course_request",
    CoursesController.handle_Accept_course_request
);
router.post(
    "/Reject_course_request",
    CoursesController.handle_Reject_course_request
);

module.exports = router;
