const express = require("express");
const app = express();   
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyToken = require("./Middleware/verifyJWT");
app.use(credentials);

app.use(cors( ));
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



app.use(verifyJWT);

app.listen(3000);

module.exports = app;
