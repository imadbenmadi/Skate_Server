const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../../models/Database");

router.get("/", async (req, res) => {
    const secretKey = process.env.ADMIN_ACCESS_TOKEN_SECRET;
    const accessToken = req.cookies.admin_accessToken;
    const refreshToken = req.cookies.admin_refreshToken;

    try {
        // Verify the access token
        jwt.verify(accessToken, secretKey, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    // Access token expired, attempt to refresh it
                    try {
                        if (!refreshToken) {
                            console.error("Refresh token is missing.");
                            return res.status(401).json({
                                error: "Unauthorized: Refresh token is missing",
                            });
                        }

                        const found_in_DB = await Refresh_tokens.findOne({
                            token: refreshToken,
                        }).exec();

                        if (!found_in_DB) {
                            console.error(
                                "Refresh token not found in the database."
                            );
                            return res.status(401).json({
                                error: "Unauthorized: Refresh token not found in the database",
                            });
                        }

                        jwt.verify(
                            refreshToken,
                            process.env.ADMIN_REFRESH_TOKEN_SECRET,
                            async (err, decoded) => {
                                if (err) {
                                    console.error(
                                        "Failed to verify JWT. Refresh token does not match.",
                                        err
                                    );
                                    return res.status(401).json({
                                        error: "Unauthorized: Failed to verify JWT. Refresh token does not match",
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
                                console.log("Token refreshed");

                                return res.status(200).json({
                                    message:
                                        "Access token refreshed successfully",
                                });
                            }
                        );
                    } catch (refreshErr) {
                        console.error("Error refreshing token:", refreshErr);
                        return res
                            .status(500)
                            .json({ error: "Internal Server Error" });
                    }
                } else {
                    // Other verification error, return unauthorized

                    return res.status(401).json({
                        error: "Unauthorized: Access token is invalid",
                    });
                }
            } else {
                return res.status(200).json({
                    message: "Access token is valid",
                });
            }
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
