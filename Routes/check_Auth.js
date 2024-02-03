const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const verifyToken = require("../Middleware/verifyJWT");
require("dotenv").config();

router.get("/", verifyToken, async (req, res) => {
    console.log(" start checking");
    try {
        // If the middleware executed successfully, the access token is valid
        return res.status(200).json({ message: "Access token is valid" });
    } catch (err) {
        console.error(err);
        if (err.name === "TokenExpiredError") {
            // If the access token is expired, try to refresh it
            try {
                const { refreshToken } = req.cookies;

                const refreshResponse = await axios.post(
                    "/Refresh",
                    {
                        refreshToken,
                    },
                    {
                        withCredentials: true,

                        validateStatus: () => true,
                    }
                );

                if (refreshResponse.data && refreshResponse.data.accessToken) {
                    // Update the access token in the cookies
                    res.cookie(
                        "accessToken",
                        refreshResponse.data.accessToken,
                        {
                            httpOnly: true,
                            sameSite: "None",
                            secure: true,
                            maxAge: 60 * 60 * 1000, // Set the new expiration time as needed
                        }
                    );

                    // Return a success message
                    return res.status(200).json({
                        message:
                            "Access token refreshed successfully check_Auth.js",
                    });
                } else {
                    // Handle the case where refreshResponse.data.accessToken is missing
                    console.error(
                        "Error refreshing access token: refreshToken not found check_Auth.js"
                    );
                    return res.status(401).json({
                        message:
                            "Error refreshing access token: refreshToken not found",
                    });
                }
            } catch (refreshErr) {
                console.error(refreshErr);
                return res.status(403).json({
                    message:
                        "Unable to refresh the access token, both tokens are not valid",
                    error: refreshErr.message,
                });
            }
        }

        // Other types of errors (not related to token expiration)
        return res.status(401).json({ error: err.message });
    }
});

module.exports = router;
