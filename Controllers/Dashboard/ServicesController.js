const mongoose = require("mongoose");
const { Services, request_Service, Users } = require("../../models/Database");
const jwt = require("jsonwebtoken");

const Verify_Admin = require("../../Middleware/Verify_Admin");
const handle_get_Services_Request = async (req, res) => {
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
        const requests = await request_Service
            .find()
            .populate({
                path: "User",
                select: "FirstName LastName Email Telephone IsEmailVerified ", // Specify the fields you want to include
            })
            .populate("Service");
        console.log(requests);
        return res.status(200).json({ requests });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const handle_add_Service = async (req, res) => {
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
        const { Title, Description, Image, Category } = req.body;

        if (!Title || !Description || !Image || !Category) {
            return res
                .status(409)
                .json({ message: "All fields are required." });
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

        return res.status(201).json({ message: "Service added successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_delete_Service = async (req, res) => {
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
        const { serviceId } = req.body;
        if (!serviceId) {
            return res
                .status(409)
                .json({ message: "serviceId fields is required." });
        }
        await Services.findByIdAndDelete(serviceId);
        return res
            .status(200)
            .json({ message: "service Deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_update_Service = async (req, res) => {
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
        const { serviceId, title, description, image, price, category, date } =
            req.body;
        if (!serviceId) {
            return res.status(409).json({ message: "service ID is required." });
        }
        const service = await Services.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "service not found." });
        }
        // Update each field if provided in the request body
        if (title) {
            service.Title = title;
        }
        if (description) {
            service.Description = description;
        }
        if (image) {
            service.Image = image;
        }
        if (price) {
            service.Price = price;
        }
        if (category) {
            service.Category = category;
        }
        if (date) {
            service.Date = date;
        }
        // Save the updated service
        await service.save();
        return res
            .status(200)
            .json({ message: "service updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_Accept_Service_request = async (req, res) => {
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
        const { UserId, ServiceId } = req.body;
        if (!UserId || !ServiceId) {
            return res
                .status(409)
                .json({ message: "All fields are required." });
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
        return res.status(200).json({ message: "Service request accepted." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_Reject_Service_request = async (req, res) => {
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
        const { UserId, ServiceId } = req.body;

        if (!UserId || !ServiceId) {
            return res
                .status(409)
                .json({ message: "All fields are required." });
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
        return res.status(200).json({ message: "Service request rejected." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
module.exports = {
    handle_get_Services_Request,
    handle_add_Service,
    handle_Accept_Service_request,
    handle_Reject_Service_request,
    handle_delete_Service,
    handle_update_Service,
};
