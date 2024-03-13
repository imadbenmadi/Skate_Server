const express = require("express");
const router = express.Router();
const ServicesController = require("../../Controllers/Dashboard/ServicesController");
router.post("/", ServicesController.handle_add_Service);
router.delete("/:id", ServicesController.handle_delete_Service);
router.put("/:id", ServicesController.handle_update_Service);
router.get("/Requests", ServicesController.handle_get_Services_Request);
router.post("/Requests/Accept", ServicesController.handle_Accept_Service_request);
router.post(
    "/Requests/Reject",
    ServicesController.handle_Reject_Service_request
);

module.exports = router;
