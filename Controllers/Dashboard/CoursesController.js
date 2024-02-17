const { Courses, request_Course, Users } = require("../../models/Database");

const Verify_Admin = require("../../Middleware/Verify_Admin");

const handle_add_Courses = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);

    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
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
const handle_delete_Courses = async (req, res)=>{
    const isAuth = await Verify_Admin(req, res);

    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const { courseId } = req.body;
        if (!courseId ) {
            return res.status(400).json({ error: "CourseId fields is required." });
        }
        await Courses.findByIdAndDelete(courseId);
        res.status(200).json({ message: "Course Deleted successfully." });
    } catch (error) {
        res.status(500).json({ error });
    }
}
const handle_update_Courses = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);

    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const { courseId, title, description, image, price, category, date } =
            req.body;
        if (!courseId) {
            return res.status(400).json({ error: "Course ID is required." });
        }
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }
        // Update each field if provided in the request body
        if (title) {
            course.Title = title;
        }
        if (description) {
            course.Description = description;
        }
        if (image) {
            course.Image = image;
        }
        if (price) {
            course.Price = price;
        }
        if (category) {
            course.Category = category;
        }
        if (date) {
            course.Date = date;
        }
        // Save the updated course
        await course.save();
        res.status(200).json({ message: "Course updated successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};


const handle_Accept_course_request = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);

    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
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
        await Users.findByIdAndUpdate(UserId, {
            $push: {
                Courses: CourseId,
                Notifications: Notificatio_ToSend,
            },
        }).exec();

        res.status(200).json({ message: "Course request accepted." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
const handle_Reject_course_request = async (req, res) => {
    const isAuth = await Verify_Admin(req, res);

    if (isAuth.status == false)
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const { UserId, CourseId } = req.body;

        if (!UserId || !CourseId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Remove the request from the database
        await request_Course.deleteMany({ UserId, CourseId });
        const Notificatio_ToSend = {
            Type: "course",
            Title: "Course request Rejected",
            Text: "Your request for the course has been Rejected",
            Date: new Date(),
        };

        await Users.findByIdAndUpdate(UserId, {
            $push: {
                Notifications: Notificatio_ToSend,
            },
        }).exec();
        res.status(200).json({ message: "Course request rejected." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
module.exports = {
    handle_add_Courses,
    handle_Accept_course_request,
    handle_Reject_course_request,
    handle_delete_Courses,
    handle_update_Courses,
};
