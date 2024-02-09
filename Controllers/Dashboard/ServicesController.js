const mongoose = require("mongoose");
const { Services, request_Service, Users } = require("../../models/Database");
const jwt = require("jsonwebtoken");

const Verify_Admin = require("../../Middleware/Verify_Admin");

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
        // Push a notification to the user
        const notificationToSend = {
            Type: "service",
            Title: "Service request accepted",
            Text: "Your request for the service has been accepted",
            Date: new Date(),
        };
        await Users.findByIdAndUpdate(UserId, {
            $push: { Notifications: notificationToSend },
        }).exec();
        res.status(200).json({ message: "Service request accepted." });
    } catch (error) {
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
        // Push a notification to the user
        const notificationToSend = {
            Type: "service",
            Title: "Service request Rejected",
            Text: "Your request for the service has been Rejected",
            Date: new Date(),
        };
        await Users.findByIdAndUpdate(UserId, {
            $push: { Notifications: notificationToSend },
        }).exec();
        res.status(200).json({ message: "Service request rejected." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
module.exports = {
    handle_add_Service,
    handle_Accept_Service_request,
    handle_Reject_Service_request,
};
