const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Users = mongoose.model(
    "Users",
    new mongoose.Schema({
        FirstName: { type: String, required: true },
        LastName: { type: String, required: true },
        Telephone: { type: String, required: true },
        Email: { type: String, required: true },
        Password: { type: String, required: true },

        Age: { type: Number },
        Gender: { type: String, enum: ["male", "female"] },
        ProfilePic: { type: String },
        Courses: [{ type: mongoose.Types.ObjectId, ref: "Courses" }],
        Services: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Services",
                service_state: { type: String },
            },
        ],
        IsEmailVerified: { type: Boolean, default: false },
        EmailVerificationToken: { type: String },
        Notifications: [
            {
                Title: { type: String },
                Message: { type: String },
                Date: { type: Date },
                Readed: { type: Boolean, default: false },
            },
        ],
    })
);
const Refresh_tokens = mongoose.model(
    "refresh_tokens",
    new mongoose.Schema({
        userId: { type: mongoose.Types.ObjectId, ref: "Users" },
        token: { type: String },
    })
);
// Dash Board
const Admin_data = mongoose.model(
    "Admin_data",
    new mongoose.Schema({
        Admin_User_Name: { type: String },
        Admin_Pwd: { type: String },
    })
);
const request_Service = mongoose.model(
    "request_Service",
    new mongoose.Schema({
        requests: [
            { UserId: { type: mongoose.Types.ObjectId, ref: "Users" } },
            { EtudeId: { type: mongoose.Types.ObjectId, ref: "Services" } },
        ],
    })
);
const Messages = mongoose.model(
    "Messages",
    new mongoose.Schema({
        Title: { type: String },
        Message: { type: String },
        Date: { type: Date },
        Sender_id: { type: mongoose.Types.ObjectId, ref: "Users" },
        Sender_email: { type: String },
    })
);
const request_Course = mongoose.model(
    "request_Course",
    new mongoose.Schema({
        UserId: { type: mongoose.Types.ObjectId, ref: "Users" },
        CourseId: { type: mongoose.Types.ObjectId, ref: "Courses" },
    })
);

// Services Courses Blogs Events
const Services = mongoose.model(
    "Services",
    new mongoose.Schema({
        Title: { type: String },
        Description: { type: String },
        Image: { type: String },
        Category: { type: String },
    })
);

const Courses = mongoose.model(
    "Courses",
    new mongoose.Schema({
        Title: { type: String },
        Description: { type: String },
        Image: { type: String },
        Price: { type: Number },
        Category: { type: String },
        Date: { type: Date },
    })
);
const Blogs = mongoose.model(
    "Blogs",
    new mongoose.Schema({
        Title: { type: String },
        Description: { type: String },
        Image: { type: String },
        Date: { type: Date },
    })
);
const Events = mongoose.model(
    "Events",
    new mongoose.Schema({
        Title: { type: String },
        Description: { type: String },
        Date: { type: Date },
        Image: { type: String },
    })
);
module.exports = {
    Users,
    Refresh_tokens,
    Messages,
    request_Course,
    request_Service,
    Services,
    Courses,
    Blogs,
    Events,
    Admin_data,
};
