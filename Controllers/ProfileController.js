const {  Users } = require("../models/Database");
require("dotenv").config();
const Verify_user = require("../Middleware/verify_user");
const EditProfile = async (req, res) => {
    if (!Verify_user(req, res))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "Messing Data" });
        }

        const userToUpdate = await Users.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ error: "User not found." });
        }

        // Extract fields that can be modified from the request body
        const {
            FirstName,
            LastName,
            Email,
            Age,
            Gender,
            Telephone,
        } = req.body;

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

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
const getProfile = async (req, res) => {
    const userId = req.body.userId;

    if (!userId) return res.status(400).json({ error: "User Id is required." });
    if (!Verify_user(req, res))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    try {
        const user_in_db = await Users.findById(userId);
        if (!user_in_db) {
            return res.status(401).json({ error: "user not found." });
        }

        res.status(200).json(user_in_db);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
const DeleteProfile = async (req, res) => {
    const userId = req.body.userId;

    if (!userId) return res.status(400).json({ error: "User Id is required." });
    try {
        const verified = await Verify_user(req, res);
        if (!verified) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid token" });
        }

        const user_in_db = await Users.findById(userId);
        if (!user_in_db) {
            return res.status(404).json({ error: "User not found." });
        }

        await Users.findByIdAndDelete(userId);
        res.status(200).json(user_in_db);
    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {
    EditProfile,
    getProfile,
    DeleteProfile,
};
