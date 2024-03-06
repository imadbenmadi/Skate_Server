const express = require("express");
const router = express.Router();
const BlogsConroller = require("../../Controllers/Dashboard/BlogsConroller");
router.post("/", BlogsConroller.handle_add_Blog);
router.delete("/", BlogsConroller.handle_delete_Blog);
router.put("/", BlogsConroller.handle_update_Blog);

module.exports = router;
