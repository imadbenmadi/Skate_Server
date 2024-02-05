const mongoose = require("mongoose");
const { Services, request_Service, Users } = require("../../models/Database");
const jwt = require("jsonwebtoken");

const Verify_Admin = (admin_accessToken) => {
    const secretKey = process.env.ADMIN_ACCESS_TOKEN_SECRET;
    if (!admin_accessToken) return false;
    try {
        const decoded = jwt.verify(admin_accessToken, secretKey);
        return true;
    } catch (err) {
        console.error("Error during token verification:", err);
        return false;
    }
};

const handle_add_Service = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { Title, Description, Image, Category } = req.body;

        if (!Title || !Description || !Image || !Category) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const creationDate = new Date();

        // Create a new Service
        const newService = new Services({
            Title,
            Description,
            Image,
            Category,
        });

        // Save the Service to the database
        await newService.save();

        res.status(201).json({ message: "Service added successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
const handle_Accept_Service_request = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { UserId, ServiceId } = req.body;
        if (!UserId || !ServiceId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Remove the request from the database
        await request_Service.deleteMany({ UserId, ServiceId });

        // Add the Service to the user's list of Services
        await Users.updateOne(
            { _id: UserId },
            {
                $push: {
                    Services: { $each: [ServiceId], $position: 0 },
                    service_state: "pending",
                },
            }
        );
        res.status(200).json({ message: "Service request accepted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
const handle_Reject_Service_request = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { UserId, ServiceId } = req.body;

        if (!UserId || !ServiceId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Remove the request from the database
        await request_Service.deleteMany({ UserId, ServiceId });

        res.status(200).json({ message: "Service request rejected." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
module.exports = {
    handle_add_Service,
    handle_Accept_Service_request,
    handle_Reject_Service_request,
};
