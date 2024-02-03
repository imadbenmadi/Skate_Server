const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios"); // Add axios for making HTTP requests
const verifyToken = require("../Middleware/verifyJWT"); // Adjust the path as needed
require("dotenv").config();

router.get("/", verifyToken, async (req, res) => {
    try {
        // If the middleware executed successfully, the access token is valid
        return res.status(200).json({ message: "Access token is valid" });
    } catch (err) {
        // Access token or refresh token verification failed
        console.error(err);

        // Check if the error is related to an invalid access token
        if (err.name === "TokenExpiredError") {
            // Access token has expired, attempt to rcheck authefresh it using the refresh token
            try {
                const { refreshToken } = req.cookies;

                // Make a request to your refresh endpoint
                const refreshResponse = await axios.post("Refresh", {
                    refreshToken,
                });

                // Check if refreshResponse.data.accessToken exists
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
                    return res
                        .status(200)
                        .json({
                            message: "Access token refreshed successfully check_Auth.js",
                           
                        });
                } else {
                    // Handle the case where refreshResponse.data.accessToken is missing
                    console.error(
                        "Error refreshing access token: accessToken not found check_Auth.js"
                    );
                    return res
                        .status(401)
                        .json({
                            message:
                                "Error refreshing access token: accessToken not found check_Auth.js",
                        });
                }
            } catch (refreshErr) {
                // Unable to refresh the access token, both tokens are not valid
                console.error(refreshErr);
                return res
                    .status(401)
                    .json({ message: "Tokens are not valid" });
            }
        }

        // Other types of errors (not related to token expiration)
        return res.status(401).json({ message: "Tokens are not valid" });
    }
});

module.exports = router;