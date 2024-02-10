const { Events,Users } = require("../../models/Database");

const Verify_Admin = require("../../Middleware/Verify_Admin");
const handle_add_Event = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { Title, Description } = req.body;

        if (!Title || !Description) {
            return res.status(400).json({ error: "All fields are required." });
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
        res.status(200).json({ message: "Event Created Successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
const handle_delete_Event = async (req, res) => {
    const token = req.cookies.admin_accessToken;
    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    try {
        const { eventeId } = req.body;
        if (!eventeId) {
            return res
                .status(400)
                .json({ error: "eventeId fields is required." });
        }
        await Events.findByIdAndDelete(eventeId);
        res.status(200).json({ message: "evente Deleted successfully." });
    } catch (error) {
        res.status(500).json({ error });
    }
};
const handle_update_Event = async (req, res) => {
    const token = req.cookies.admin_accessToken;
    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    try {
        const { eventeId, title, description, image, price, category, date } =
            req.body;
        if (!eventeId) {
            return res.status(400).json({ error: "evente ID is required." });
        }
        const evente = await Events.findById(eventeId);
        if (!evente) {
            return res.status(404).json({ error: "evente not found." });
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
        res.status(200).json({ message: "evente updated successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
module.exports = { handle_add_Event, handle_delete_Event, handle_update_Event };
