const express = require("express");
const router = express.Router();
const EventsController = require("../Controllers/EventsController");
router.get("/", EventsController.getAllEvents);
router.get("/:id", EventsController.get_Event_ById);
module.exports = router;
