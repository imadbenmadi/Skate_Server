const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../../models/Database");

router.get("/", async (req, res) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
        // Verify the access token
        jwt.verify(accessToken, secretKey, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    // Access token expired, attempt to refresh it
                    try {
                        if (!refreshToken) {
                            return res.status(401).json({
                                error: "Unauthorized: Refresh token is missing",
                            });
                        }

                        const found_in_DB = await Refresh_tokens.findOne({
                            token: refreshToken,
                        }).exec();

                        if (!found_in_DB) {
                            return res.status(401).json({
                                error: "Unauthorized",
                            });
                        }

                        jwt.verify(
                            refreshToken,
                            process.env.REFRESH_TOKEN_SECRET,
                            async (err, decoded) => {
                                if (err) {
                                    return res.status(401).json({
                                        error: "Unauthorized",
                                    });
                                } else if (
                                    found_in_DB.userId != decoded.userId
                                ) {
                                    return res.status(401).json({
                                        error: "Unauthorized",
                                    });
                                }

                                // Generate new access token
                                const newAccessToken = jwt.sign(
                                    { userId: decoded.userId },
                                    process.env.ACCESS_TOKEN_SECRET,
                                    { expiresIn: "1h" }
                                );
                                res.cookie("accessToken", newAccessToken, {
                                    httpOnly: true,
                                    sameSite: "None",
                                    secure: true,
                                    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
                                });
                                const user = await Users.findOne({
                                    _id: decoded.userId,
                                });
                                const UserData_To_Send = {
                                    _id: user._id,
                                    Email: user.Email,
                                    FirstName: user.FirstName,
                                    LastName: user.LastName,
                                    Notifications: user.Notifications,
                                    Courses: user.Courses,
                                    Services: user.Services,
                                    Gender: user.Gender,
                                    IsEmailVerified: user.IsEmailVerified,
                                };
                                return res.status(200).json({
                                    message:
                                        "Access token refreshed successfully",
                                    userData: UserData_To_Send,
                                });
                            }
                        );
                    } catch (refreshErr) {
                        return res
                            .status(500)
                            .json({ error: refreshErr });
                    }
                } else {
                    return res.status(401).json({
                        error: "Unauthorized: Access token is invalid",
                    });
                }
            } else {
                const user = await Users.findOne({ _id: decoded.userId });
                console.log("user data to sendd in check auth",user);
                const UserData_To_Send = {
                    _id: user._id,
                    Email: user.Email,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Notifications: user.Notifications,
                    Courses: user.Courses,
                    Services: user.Services,
                    Gender: user.Gender,
                    IsEmailVerified: user.IsEmailVerified,
                };
                return res.status(200).json({
                    message: "Access token is valid",
                    userData: UserData_To_Send,
                });
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

module.exports = router;
