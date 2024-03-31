const express = require("express");
const router = express.Router();
const ProfileController = require("../Controllers/ProfileController");
router.put("/:id", ProfileController.EditProfile);
router.get("/:id", ProfileController.getProfile);
router.delete("/:id", ProfileController.DeleteProfile);
router.delete("/:id/Notifications", ProfileController.DeleteNotification);
// router.post("/:id/Notifications", ProfileController.ReadedNotification);
module.exports = router;
