const express = require("express");
const router = express.Router();
const BlogsConroller = require("../../controllers/Dashboard/BlogsConroller");
router.post("/", BlogsConroller.handle_add_Blog);


module.exports = router;
