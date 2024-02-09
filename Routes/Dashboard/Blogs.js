const express = require("express");
const router = express.Router();
const BlogsConroller = require("../../controllers/Dashboard/BlogsConroller");
// const Verify_Admin = require("./../../Middleware/Verify_Admin ");
router.post("/", BlogsConroller.handle_add_Blog);


module.exports = router;
