const express = require("express");
const router = express.Router();
const UsersConroller = require("../../controllers/Dashboard/UsersController");
router.post("/", UsersConroller.handle_add_User);
router.delete("/", UsersConroller.handle_delete_User);

module.exports = router;
