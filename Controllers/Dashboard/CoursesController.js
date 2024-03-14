const { Courses, request_Course, Users } = require("../../models/Database");

const Verify_Admin = require("../../Middleware/Verify_Admin");

const handle_add_Courses = async (req, res) => {
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
        const { Title, Description, Price, Category } = req.body;
        if (!Title || !Description || !Price || !Category) {
            return res
                .status(409)
                .json({ message: "All fields are required." });
        }
        const creationDate = new Date();
        // Create a new course
        const newCourse = new Courses({
            Title,
            Description,
            Price,
            Category,
            Date: creationDate,
        });
        // Save the course to the database
        await newCourse.save();
        return res.status(200).json({ message: "Course added successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_delete_Courses = async (req, res) => {
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
        const { id } = req.params;
        if (!id) {
            return res
                .status(409)
                .json({ message: "CourseId fields is required." });
        }
        await Courses.findByIdAndDelete(id);
        await request_Course.deleteMany({ Course: id });
        return res
            .status(200)
            .json({ message: "Course Deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_update_Courses = async (req, res) => {
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
        const { Title, Description, image, Price, Category, date } = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(409).json({ message: "Course ID Not Found." });
        }
        const course = await Courses.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        // Update each field if provided in the request body
        if (Title) {
            course.Title = Title;
        }
        if (Description) {
            course.Description = Description;
        }
        if (image) {
            course.Image = image;
        }
        if (Price) {
            course.Price = Price;
        }
        if (Category) {
            course.Category = Category;
        }
        if (date) {
            course.Date = date;
        }
        // Save the updated course
        await course.save();
        return res
            .status(200)
            .json({ message: "Course updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_get_Courses_Request = async (req, res) => {
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
        const requests = await request_Course
            .find()
            .populate({
                path: "User",
                select: "FirstName LastName Email Telephone IsEmailVerified ", // Specify the fields you want to include
            })
            .populate("Course");
        return res.status(200).json({ requests });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
const handle_Accept_course_request = async (req, res) => {
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
        const { UserId, CourseId } = req.body;

        if (!UserId || !CourseId) {
            return res
                .status(409)
                .json({ message: "All fields are required." });
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

        return res.status(200).json({ message: "Course request accepted." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};
const handle_Reject_course_request = async (req, res) => {
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
        const { UserId, CourseId } = req.body;

        if (!UserId || !CourseId) {
            return res
                .status(409)
                .json({ message: "All fields are required." });
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
        return res.status(200).json({ message: "Course request rejected." });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};
module.exports = {
    handle_add_Courses,
    handle_Accept_course_request,
    handle_Reject_course_request,
    handle_delete_Courses,
    handle_update_Courses,
    handle_get_Courses_Request,
};
