const express = require("express");
const router = express.Router();
const ServicesController = require("../Controllers/ServicesController");
router.get("/", ServicesController.getAllServices);
router.get("/userServices", ServicesController.get_Services_By_user_Id);
router.get("/:id", ServicesController.get_Service_ById);

router.post("/request", ServicesController.handle_request_Service);
module.exports = router;
