const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const verifyToken = require("../Middleware/verifyJWT");
require("dotenv").config();

router.get("/", async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        // console.log("acesstoken to verify :" , token);
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
                        // If the access token is expired, try to refresh it
                        // try {
                        //     const refreshResponse = await axios.post(
                        //         "http://localhost:3000/Refresh", // Adjust the refresh endpoint URL
                        //         {},
                        //         {
                        //             withCredentials: true,
                        //             validateStatus: () => true,
                        //             headers: {
                        //                 Cookie: `refreshToken=${encodeURIComponent(
                        //                     req.cookies.refreshToken
                        //                 )};`,
                        //             },
                        //         }
                        //     );
                        //     console.log(refreshResponse.data);

                        //     if (
                        //         refreshResponse.data &&
                        //         refreshResponse.data.accessToken
                        //     ) {
                        //         return res.status(200).json({
                        //             message:
                        //                 "Access token refreshed successfully",
                        //         });
                        //     } else {
                        //         // Handle the case where refreshResponse.data.accessToken is missing
                        //         console.error("Error refreshing access token");
                        //         return res.status(401).json({
                        //             message: "Error refreshing access token",
                        //         });
                        //     }
                        // } catch (refreshErr) {
                        //     console.error(refreshErr);
                        //     return res.status(403).json({
                        //         message:
                        //             "Unable to refresh the access token, both tokens are not valid",
                        //         error: refreshErr.message,
                        //     });
                        // }
                        return res.status(401).json({
                            message: "invalid token",
                        });
                    }

                    // Other types of errors (not related to token expiration)
                    return res.status(401).json({ error: err.message });
                }

                return res
                    .status(200)
                    .json({ message: "Access token is valid" });
            }
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
