const express = require("express");
const app = express();   
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");


app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.set("strictQuery", false);
const mongoDB = "mongodb://127.0.0.1:27017/Skate";
async function connect_to_db() {
    await mongoose.connect(mongoDB, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });
}
connect_to_db().catch((err) => console.log(err));


app.use("/Login", require("./api/Auth/Login"));
app.use("/Register", require("./api/Auth/Register"));
// app.use("/Logout", require("./api/Auth/Logout"));
app.listen(3000);

module.exports = app;
