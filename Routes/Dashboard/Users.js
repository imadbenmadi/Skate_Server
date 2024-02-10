const express = require("express");
const router = express.Router();
const UsersConroller = require("../../controllers/Dashboard/UsersController");
router.post("/", UsersConroller.handle_add_User);
router.delete("/", UsersConroller.handle_delete_User);
router.put("/", UsersConroller.handle_modify_User);
router.get("/", UsersConroller.getAllUsers);
router.get("/:id", UsersConroller.get_user);
module.exports = router;
