const express = require("express");
const router = express.Router();
const CoursesController = require("../../Controllers/Dashboard/CoursesController");
router.post("/", CoursesController.handle_add_Courses);
router.delete("/:id", CoursesController.handle_delete_Courses);
router.put("/:id", CoursesController.handle_update_Courses);
router.get("/Requests", CoursesController.handle_get_Courses_Request);
router.post(
    "/Accept_course_request",
    CoursesController.handle_Accept_course_request
);
router.post(
    "/Reject_course_request",
    CoursesController.handle_Reject_course_request
);

module.exports = router;
