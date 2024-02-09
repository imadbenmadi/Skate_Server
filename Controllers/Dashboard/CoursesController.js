const mongoose = require("mongoose");
const { Courses, request_Course,Users } = require("../../models/Database");
const jwt = require("jsonwebtoken");

const Verify_Admin = require("../../Middleware/Verify_Admin")

const handle_add_Courses = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    try {
        const { Title, Description, Image, Price, Category } = req.body;
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
        res.status(500).json({ error: "Internal server error." });
    }
};
const handle_Accept_course_request = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { UserId, CourseId } = req.body;

        if (!UserId || !CourseId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Remove the request from the database
        await request_Course.deleteMany({ UserId, CourseId });
        
        const Notificatio_ToSend = {
            Type: "course",
            Title: "Course request accepted",
            Text: "Your request for the course has been accepted",
            Date: new Date(),
        };
        // Add the course to the user's list of courses , adn Notify him
       const updateOperations = [
           Users.findByIdAndUpdate(UserId, {
               $push: { Courses: CourseId },
           }).exec(),
           Users.findByIdAndUpdate(UserId, {
               $push: { Notifications: Notificatio_ToSend },
           }).exec(),
       ];
       await Promise.all(updateOperations);

        res.status(200).json({ message: "Course request accepted." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}
const handle_Reject_course_request = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { UserId, CourseId } = req.body;

        if (!UserId || !CourseId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Remove the request from the database
        await request_Course.deleteMany({ UserId, CourseId });

        res.status(200).json({ message: "Course request rejected." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}
module.exports = { handle_add_Courses, handle_Accept_course_request, handle_Reject_course_request};
