const { Blogs } = require("../../models/Database");

const Verify_Admin = require("../../Middleware/Verify_Admin");
const handle_add_Blog = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);

    if (isAuth.status == false)
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const { Title, Text, Description } = req.body;

        if (!Title || !Description || !Text) {
            return res
                .status(409)
                .json({ message: "All fields are required." });
        }
        const generatedFilename = req.body.generatedFilename;
        const NewBlog = new Blogs({
            Title,
            Text,
            Description,
            Image : generatedFilename,
        });
        await NewBlog.save();

        return res.status(200).json({ message: "Blog Created Successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_delete_Blog = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);
    if (isAuth.status == false)
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(409)
                .json({ message: "Blogid fields is required." });
        }
        await Blogs.findByIdAndDelete(id);
        return res.status(200).json({ message: "Blog Deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_update_Blog = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);

    if (isAuth.status == false)
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const { Title, Text, Description, image, date } = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(409).json({ message: "blog ID is required." });
        }
        const blog = await Blogs.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "blog not found." });
        }
        // Update each field if provided in the request body
        if (Title) {
            blog.Title = Title;
        }
        if (Text) {
            blog.Text = Text;
        }
        if (Description) {
            blog.Description = Description;
        }
        if (image) {
            blog.Image = image;
        }
        if (date) {
            blog.Date = date;
        }
        // Save the updated blog
        await blog.save();
        return res.status(200).json({ message: "blog updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = { handle_add_Blog, handle_delete_Blog, handle_update_Blog };
