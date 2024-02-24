const mongoose = require("mongoose");
const { Services, Users, request_Service } = require("../models/Database");
require("dotenv").config();
const Verify_user = require("../Middleware/verify_user");
const getAllServices = async (req, res) => {
    try {
        const services = await Services.find();
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ error: error });
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

       return res.status(200).json(Service);
    } catch (error) {
       return res.status(500).json({ error: error });
    }
};
const get_Services_By_user_Id = async (req, res) => {
    const userId = req.params._idd;
    if (!userId) return res.status(400).json({ error: "User Id is required." });
    const isAuth = await Verify_user(req, res);
    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const user_in_db = await Users.findById(userId).populate("Services");
        if (!user_in_db) {
            return res.status(401).json({ error: "user not found." });
        }

       return res.status(200).json(user_in_db.Services);
    } catch (error) {
       return res.status(500).json({ error:error });
    }
};
const handle_request_Service = async (req, res) => {
    const { ServiceId, userId } = req.body;
    const accessToken = req.cookies.accessToken;
    if (!ServiceId || !userId) {
        return res.status(400).json({ error: "Messing Data." });
    }
    const isAuth = await Verify_user(req, res);
    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
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
      return res
          .status(200)
          .json({ message: "Service requested successfully." });
    } catch (error) {
       return res.status(500).json({ error: error });
    }
};
module.exports = {
    getAllServices,
    get_Services_By_user_Id,
    get_Service_ById,
    handle_request_Service,
};
