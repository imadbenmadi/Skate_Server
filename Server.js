const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();   
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const credentials = require("./Middleware/credentials");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const verifyJWT = require("./Middleware/verifyJWT");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
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


app.use("/Login", require("./Routes/Login"));
app.use("/Register", require("./Routes/Register"));
app.use("/Logout", require("./Routes/Logout"));
app.use("/Refresh", require("./Routes/Refresh"));
app.use("/check_Auth", require("./Routes/check_Auth"));
// app.use(verifyJWT);

app.listen(3000);

module.exports = app;
