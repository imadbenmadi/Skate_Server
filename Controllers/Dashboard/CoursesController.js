const mongoose = require("mongoose");
const { Courses } = require("../../models/Database");

const handle_add_Courses = async (req, res) => {
    try {
        const { Title, Description, Image, Price, Category } = req.body;

        if (!Title || !Description || !Image || !Price || !Category) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const Date = new Date();
        // Create a new course
        const newCourse = new Courses({
            Title,
            Description,
            Image,
            Price,
            Category,
            Date,
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
