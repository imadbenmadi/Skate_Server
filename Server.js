const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const credentials = require("./Middleware/credentials");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const limiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 100 requests per windowMs
    message: "Too many requests ,try again later.",
});
app.use(limiter);
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static(path.join(__dirname, "/Public")));

mongoose.set("strictQuery", false);
const mongoDB = "mongodb://127.0.0.1:27017/Skate";
async function connect_to_db() {
    await mongoose.connect(mongoDB, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });
}
connect_to_db().catch((err) => console.log(err));
app.use("/check_Auth", require("./Routes/Auth/check_Auth"));
app.use("/VerifyAccount", require("./Routes/Auth/verifyAccount"));
app.use("/Send_Verification_Email", require("./Routes/Auth/Send_Verification_Email"));
app.use("/is_email_verified", require("./Routes/Auth/is_email_verified"));


app.use("/Login", require("./Routes/Auth/Login"));
app.use("/Register", require("./Routes/Auth/Register"));
app.use("/Logout", require("./Routes/Auth/Logout"));
app.use("/Refresh", require("./Routes/Auth/Refresh"));


app.use("/Contact", require("./Routes/Contact"));
app.use("/Courses", require("./Routes/Courses"));
app.use("/Services", require("./Routes/Services"));



app.use("/Dashboard/Login", require("./Routes/Dashboard/Admin_Login"));
app.use("/Dashboard/Courses", require("./Routes/Dashboard/Courses"));
// app.use("/Dashboard/AddAdmin", require("./Routes/Dashboard/Add_Admin"));

// app.use("/Dashboard", require("./Routes/Dashboard/Dashboard"));
// app.use(verifyJWT);

app.listen(3000);

module.exports = app;
