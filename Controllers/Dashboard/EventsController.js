const { Events, Users } = require("../../models/Database");

const Verify_Admin = require("../../Middleware/Verify_Admin");
const handle_add_Event = async (req, res) => {
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
        const { Title, Description } = req.body;

        if (!Title || !Description) {
            return res
                .status(400)
                .json({ message: "All fields are required." });
        }
        const NewBlog = new Events({
            Title,
            Description,
        });
        await NewBlog.save();
        // Push notification to all users
        const notificationToSend = {
            Type: "event",
            Title: "New Event Added",
            Text: `A new event "${Title}" has been added.`,
            Date: new Date(),
        };

        const users = await Users.find({}, { _id: 1 }).exec();
        const userIds = users.map((user) => user._id);

        await Users.updateMany(
            { _id: { $in: userIds } },
            { $push: { Notifications: notificationToSend } }
        );
        return res.status(200).json({ message: "Event Created Successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_delete_Event = async (req, res) => {
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
        const { eventeId } = req.body;
        if (!eventeId) {
            return res
                .status(400)
                .json({ message: "eventeId fields is required." });
        }
        await Events.findByIdAndDelete(eventeId);
        return res
            .status(200)
            .json({ message: "evente Deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_update_Event = async (req, res) => {
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
        const { eventeId, title, description, image, price, category, date } =
            req.body;
        if (!eventeId) {
            return res.status(400).json({ message: "evente ID is required." });
        }
        const evente = await Events.findById(eventeId);
        if (!evente) {
            return res.status(404).json({ message: "evente not found." });
        }
        // Update each field if provided in the request body
        if (title) {
            evente.Title = title;
        }
        if (description) {
            evente.Description = description;
        }
        if (image) {
            evente.Image = image;
        }
        if (price) {
            evente.Price = price;
        }
        if (category) {
            evente.Category = category;
        }
        if (date) {
            evente.Date = date;
        }
        // Save the updated evente
        await evente.save();
        return res
            .status(200)
            .json({ message: "evente updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
module.exports = { handle_add_Event, handle_delete_Event, handle_update_Event };
