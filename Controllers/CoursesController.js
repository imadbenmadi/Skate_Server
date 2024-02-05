const mongoose = require("mongoose");
const { Courses, Users, request_Course } = require("../models/Database");
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
const getAllCourses = async (req, res) => {
    try {
        const courses = await Courses.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
const get_course_ById = async (req, res) => {
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ error: "Invalid course ID." });
    }

    try {
        const course = await Courses.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const get_courses_By_user_Id = async (req, res) => {
    
    const userId = req.body.id;
    const accessToken = req.cookies.accessToken;
    if(!userId) return res.status(400).json({ error: "User Id is required." });
    if (!Verify_user(accessToken))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    try {
        const user_in_db = await Users.findById(userId).populate("Courses");
        if (!user_in_db) {
            return res.status(401).json({ error: "user not found." });
        }

        res.status(200).json(user_in_db.Courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};
const handle_request_Course = async (req, res) => {
    const { courseId, userId } = req.body;
    const accessToken = req.cookies.accessToken;
    if (!courseId || !userId) {
        return res.status(400).json({ error: "Messing Data." });
    }
    if (!Verify_user(accessToken))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }
        const new_request_Course = new request_Course({
            UserId: userId,
            CourseId: courseId,
        })
        await new_request_Course.save();
        res.status(200).json({ message: "Course requested successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
}
module.exports = {
    getAllCourses,
    get_courses_By_user_Id,
    get_course_ById,
    handle_request_Course,
};
