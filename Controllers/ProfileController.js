const { Users , request_Course, request_Service } = require("../models/Database");
require("dotenv").config();
const Verify_user = require("../Middleware/verify_user");
const EditProfile = async (req, res) => {
    const isAuth = await Verify_user(req, res);
    if (isAuth.status == false)
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(409).json({ message: "Messing Data" });
        }

        const userToUpdate = await Users.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found." });
        }

        // Extract fields that can be modified from the request body
        const { FirstName, LastName, Email, Age, Gender, Telephone } = req.body;

        // Update individual fields
        if (FirstName) {
            userToUpdate.FirstName = FirstName;
        }
        if (LastName) {
            userToUpdate.LastName = LastName;
        }
        if (Email) {
            userToUpdate.Email = Email;
        }

        if (Age) {
            userToUpdate.Age = Age;
        }
        if (Gender) {
            userToUpdate.Gender = Gender;
        }
        if (Telephone) {
            userToUpdate.Telephone = Telephone;
        }

        // Save the updated user
        await userToUpdate.save();

        return res
            .status(200)
            .json({ message: "Profile updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const getProfile = async (req, res) => {
    const userId = req.params.id;

    if (!userId) return res.status(409).json({ message: "Messing Data" });
    const isAuth = await Verify_user(req, res);
    if (isAuth.status == false)
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const user_in_db = await Users.findById(userId);
        if (!user_in_db) {
            return res.status(401).json({ message: "user not found." });
        }
        const Courses_requests = await request_Course.find({ user: userId });
        const Services_requests = await request_Service.find({ user: userId });
        const userData = {
            user: user_in_db,
            Courses_requests,
            Services_requests,
        };
        return res.status(200).json({ userData});
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const DeleteProfile = async (req, res) => {
    const {userId} = req.params;

    if (!userId) return res.status(409).json({ message: "Messing Data" });
    try {
        const verified = await Verify_user(req, res);
        if (!verified) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid token" });
        }

        const user_in_db = await Users.findById(userId);
        if (!user_in_db) {
            return res.status(404).json({ message: "User not found." });
        }

        await Users.findByIdAndDelete(userId);
        return res.status(200).json(user_in_db);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const ReadedNotification = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(409).json({ message: "Messing Data" });
    }
    try {
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const notification = user.Notifications.id(req.body.notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }
        notification.Readed = true;
        await user.save();
        return res.status(200).json({ message: "Notification readed." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    const { notificationId } = req.body;

    try {
        if (!id || !notificationId) {
            return res
                .status(400)
                .json({
                    message: "Missing userId or Notification ID",
                });
        }

        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Find the notification in the user's Notifications array by its ID
        const notification = user.Notifications.find(
            (notification) => notification._id.toString() === notificationId
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        notification.remove();
        await user.save();
        return res.status(200).json({ message: "Notification deleted." });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    EditProfile,
    getProfile,
    DeleteProfile,
    ReadedNotification,
    deleteNotification,
};
