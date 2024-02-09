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
module.exports = { handle_add_Event };
