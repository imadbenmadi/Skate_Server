const express = require("express");
const router = express.Router();
const ProfileController = require("../Controllers/ProfileController");
router.put("/", ProfileController.EditProfile);
router.get("/", ProfileController.getProfile);
router.delete("/", ProfileController.DeleteProfile);
module.exports = router;
