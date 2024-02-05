const mongoose = require("mongoose");
const { Courses } = require("../../models/Database");
const jwt = require("jsonwebtoken");

const Verify_Admin = (admin_accessToken) => {
    const secretKey = process.env.ADMIN_ACCESS_TOKEN_SECRET;
    console.log("Admin Token:", admin_accessToken);
    console.log("Secret Key:", secretKey);

    if (!admin_accessToken) return false;

    try {
        const decoded = jwt.verify(admin_accessToken, secretKey);
        return true;
    } catch (err) {
        console.error("Error during token verification:", err);
        return false;
    }
};

const handle_add_Courses = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { Title, Description, Image, Price, Category } = req.body;

        console.log(req.body);

        if (!Title || !Description || !Image || !Category) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const creationDate = new Date();

        // Create a new course
        const newCourse = new Courses({
            Title,
            Description,
            Image,
            Price,
            Category,
            Date: creationDate,
        });

        // Save the course to the database
        await newCourse.save();

        res.status(201).json({ message: "Course added successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { handle_add_Courses };
