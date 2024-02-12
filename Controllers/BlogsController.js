const { Blogs, Users } = require("../models/Database");
require("dotenv").config();
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blogs.find({});
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
const get_Blog_ById = async (req, res) => {
    const blogId = req.body.id;

    if (!blogId) {
        return res.status(400).json({ error: "Invalid blog ID." });
    }

    try {
        const blog = await Blogs.findById(blogId);

        if (!blog) {
            return res.status(404).json({ error: "blog not found." });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {
    getAllBlogs,
    get_Blog_ById,
};
