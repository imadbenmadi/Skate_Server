const express = require("express");
const router = express.Router();
const ServicesController = require("../../Controllers/Dashboard/ServicesController");
router.post("/", ServicesController.handle_add_Service);
router.delete("/", ServicesController.handle_delete_Service);
router.put("/", ServicesController.handle_update_Service);
router.get("/Requests", ServicesController.handle_get_Services_Request);
router.post(
    "/Accept_course_request",
    ServicesController.handle_Accept_Service_request
);
router.post(
    "/Reject_course_request",
    ServicesController.handle_Reject_Service_request
);

module.exports = router;
