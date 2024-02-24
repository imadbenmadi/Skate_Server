const { Blogs } = require("../../models/Database");

const Verify_Admin = require("../../Middleware/Verify_Admin");
const handle_add_Blog = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);
    
    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
        
    }
    try {
        const { Title, Description } = req.body;

        if (!Title || !Description) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const NewBlog = new Blogs({
            Title,
            Description,
        });
        await NewBlog.save();

        return res.status(200).json({ message: "Blog Created Successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};
const handle_delete_Blog = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);
    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        }); 
    }
    try {
        const { blogId } = req.body;
        if (!blogId) {
            return res
                .status(400)
                .json({ error: "Blogid fields is required." });
        }
        await Blogs.findByIdAndDelete(blogId);
        return res.status(200).json({ message: "Blog Deleted successfully." });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
const handle_update_Blog = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);

    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const { blogId, title, description, image, price, category, date } =
            req.body;
        if (!blogId) {
            return res.status(400).json({ error: "blog ID is required." });
        }
        const blog = await Blogs.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "blog not found." });
        }
        // Update each field if provided in the request body
        if (title) {
            blog.Title = title;
        }
        if (description) {
            blog.Description = description;
        }
        if (image) {
            blog.Image = image;
        }
        if (price) {
            blog.Price = price;
        }
        if (category) {
            blog.Category = category;
        }
        if (date) {
            blog.Date = date;
        }
        // Save the updated blog
        await blog.save();
        return res.status(200).json({ message: "blog updated successfully." });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { handle_add_Blog, handle_delete_Blog, handle_update_Blog };
