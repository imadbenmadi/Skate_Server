const mongoose = require("mongoose");
const { Services, Users, request_Service } = require("../models/Database");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Verify_user = (accessToken) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!accessToken) return false;

    try {
        const decoded = jwt.verify(accessToken, secretKey);
        return true;
    } catch (err) {
        console.error("Error during token verification:", err);
        return false;
    }
};
const getAllServices = async (req, res) => {
    try {
        const Services = await Services.find();
        res.status(200).json(Services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
const get_Service_ById = async (req, res) => {
    const ServiceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ServiceId)) {
        return res.status(400).json({ error: "Invalid Service ID." });
    }

    try {
        const Service = await Services.findById(ServiceId);

        if (!Service) {
            return res.status(404).json({ error: "Service not found." });
        }

        res.status(200).json(Service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
const get_Services_By_user_Id = async (req, res) => {
    console.log(req.body);
    const userId = req.body.userId;
    const accessToken = req.cookies.accessToken;
    if (!userId) return res.status(400).json({ error: "User Id is required." });
    if (!Verify_user(accessToken))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    try {
        const user_in_db = await Users.findById(userId).populate("Services");
        if (!user_in_db) {
            return res.status(401).json({ error: "user not found." });
        }

        res.status(200).json(user_in_db.Services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
const handle_request_Service = async (req, res) => {
    const { ServiceId, userId } = req.body;
    const accessToken = req.cookies.accessToken;
    if (!ServiceId || !userId) {
        return res.status(400).json({ error: "Messing Data." });
    }
    if (!Verify_user(accessToken))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const existingRequest = await request_Service.findOne({
            UserId: userId,
            ServiceId: ServiceId,
        });

        if (existingRequest) {
            return res
                .status(409)
                .json({ error: "Service already requested by the user." });
        }
        const Service = await Services.findById(ServiceId);
        if (!Service) {
            return res.status(404).json({ error: "Service not found." });
        }
        const new_request_Service = new request_Service({
            UserId: userId,
            ServiceId: ServiceId,
        });
        await new_request_Service.save();
        res.status(200).json({ message: "Service requested successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
module.exports = {
    getAllServices,
    get_Services_By_user_Id,
    get_Service_ById,
    handle_request_Service,
};
