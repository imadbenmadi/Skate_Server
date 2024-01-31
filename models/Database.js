const mongoose = require("mongoose");

const Users = mongoose.model(
    "Users",
    new mongoose.Schema({
        FirstName: { type: String, required: true },
        LastName: { type: String, required: true },
        Email: { type: String, required: true },
        Password: { type: String, required: true },
        Age: { type: Number },
        Gender: { type: String, enum: ["man", "woman"] },
        ProfilePic: { type: String },
        Courses: [{ type: mongoose.Types.ObjectId, ref: "Courses" }],
    })
);
// Dash Board
const request_Etude = mongoose.model(
    "request_Etude",
    new mongoose.Schema({
        requests: [
            { UserId: { type: mongoose.Types.ObjectId, ref: "Users" } },
            { EtudeId: { type: mongoose.Types.ObjectId, ref: "Etudes" } },
        ],
    })
);
const Messages = mongoose.model(
    "Messages",
    new mongoose.Schema({
        Message: { type: String },
        Date: { type: Date },
        Sender: { type: mongoose.Types.ObjectId, ref: "Users" },
    })
);
const request_Course = mongoose.model( 
    "request_Course",
    new mongoose.Schema({
        requests: [
            { UserId: { type: mongoose.Types.ObjectId, ref: "Users" } },
            { CourseId: { type: mongoose.Types.ObjectId, ref: "Courses" } },
        ],
    })
);
// Etudes Courses Blogs Events
const Etudes = mongoose.model(
    "Etudes",
    new mongoose.Schema({
        Title: { type: String },
        Description: { type: String },
        Image: { type: String },
        Price: { type: Number },
        Category: { type: String },
        Date: { type: Date },
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
    Events,
    Courses,
};
