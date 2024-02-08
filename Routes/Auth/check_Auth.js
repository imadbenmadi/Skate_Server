const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../../models/Database");

router.get("/", async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res
                .status(401)
                .json({ error: "Unauthorized: acessToken is missing" });
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        
                        return res.status(401).json({
                            message: "invalid token",
                        });
                    }

                    // Other types of errors (not related to token expiration)
                    return res.status(401).json({ error: err.message });
                }
                const user = await Users.findOne({ _id: decoded.userId });
                 const UserData_To_Send = {
                     _id: user._id,
                     Email: user.Email,
                     FirstName: user.FirstName,
                     LastName: user.LastName,
                     Notifications: user.Notifications,
                     Courses: user.Courses,
                     Services : user.Services,
                     Gender: user.Gender,
                     IsEmailVerified: user.IsEmailVerified,
                 };
                return res.status(200).json({
                    message: "Access token is valid",
                    userData: UserData_To_Send,
                });
            }
        );
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
