const express = require("express");
const router = express.Router();
const EventsController = require("../../controllers/Dashboard/EventsController");
router.post("/", EventsController.handle_add_Event);
router.delete("/", EventsController.handle_delete_Event);
router.put("/", EventsController.handle_update_Event);
module.exports = router;
