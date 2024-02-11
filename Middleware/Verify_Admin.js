require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Refresh_tokens } = require("../models/Database");

const Verify_Admin = async(req, res) => {
    const secretKey = process.env.ADMIN_ACCESS_TOKEN_SECRET;
    const accessToken = req.cookies.admin_accessToken;
    const refreshToken = req.cookies.admin_refreshToken;
    
    try {
        const decoded = jwt.verify(accessToken, secretKey);
        return true;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            // Token expired, attempt to refresh it
            try {
                if (!refreshToken) {
                    console.error("Refresh token is missing.");
                    return false;
                }

                const found_in_DB = await Refresh_tokens.findOne({
                    token: refreshToken,
                }).exec();

                if (!found_in_DB) {
                    console.error("Refresh token not found in the database.");
                    return false;
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
                            return false;
                        } 

                        // Generate new access token
                        const newAccessToken = jwt.sign(
                            { userId: decoded.userId },
                            process.env.ADMIN_ACCESS_TOKEN_SECRET,
                            { expiresIn: "3s" }
                        );
                        res.cookie("admin_accessToken", newAccessToken, {
                            httpOnly: true,
                            sameSite: "None",
                            secure: true,
                            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
                        });
                        // Update the access token wherever it's stored (e.g., in a cookie)
                        // For example, res.cookie("accessToken", newAccessToken, { ... });
                        console.log("token refreshed");
                        return true;
                    }
                );
            } catch (refreshErr) {
                console.error("Error refreshing token:", refreshErr);
                return false;
            }
        } else {
            // Other verification error, return false
            console.error("Error verifying token:", err);
            return false;
        }
    }
};
module.exports = Verify_Admin;
