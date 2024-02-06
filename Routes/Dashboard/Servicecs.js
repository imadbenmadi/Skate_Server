const express = require("express");
const router = express.Router();
const ServicesController = require("../../controllers/Dashboard/ServicesController");
router.post("/", ServicesController.handle_add_Service);
router.post(
    "/Accept_course_request",
    ServicesController.handle_Accept_Service_request
);
router.post(
    "/Reject_course_request",
    ServicesController.handle_Reject_Service_request
);

module.exports = router;