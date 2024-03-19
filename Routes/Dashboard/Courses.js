const express = require("express");
const router = express.Router();
const CoursesController = require("../../Controllers/Dashboard/CoursesController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const destinationPath = path.join(__dirname, "../../Public/Courses");
            // Create the destination directory if it doesn't exist
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }
            cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileExtension = path.extname(file.originalname);
            const generatedFilename = `${uniqueSuffix}${fileExtension}`;
            req.generatedFilename = generatedFilename;
            cb(null, generatedFilename);
        },
    }),
});
router.post(
    "/",
    upload.single("image"),
    (req, res, next) => {
        req.body.generatedFilename = req.generatedFilename;
        next();
    },
    CoursesController.handle_add_Courses
);
router.delete("/:id", CoursesController.handle_delete_Courses);
router.put(
    "/:id",
    upload.single("image"),
    (req, res, next) => {
        req.body.generatedFilename = req.generatedFilename;
        next();
    },
    CoursesController.handle_update_Courses
);
router.get("/Requests", CoursesController.handle_get_Courses_Request);
router.post(
    "/Requests/Accept",
    CoursesController.handle_Accept_course_request
);
router.post(
    "/Requests/Reject",
    CoursesController.handle_Reject_course_request
);

module.exports = router;
