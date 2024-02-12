const express = require("express");
const router = express.Router();
const BlogsController = require("../Controllers/BlogsController");
router.get("/", BlogsController.getAllBlogs);
router.get("/:id", BlogsController.get_Blog_ById);
module.exports = router;
