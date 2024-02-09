const express = require("express");
const router = express.Router();
const EventsController = require("../../controllers/Dashboard/EventsController");
router.post("/", EventsController.handle_add_Event);

module.exports = router;
