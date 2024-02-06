require("dotenv").config();
const jwt = require("jsonwebtoken");

const Verify_user = (accessToken) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!accessToken) return false;

    try {
        const decoded = jwt.verify(accessToken, secretKey);
        return true;
    } catch (err) {
        console.error("Error during token verification:", err);
        return false;
    }
};
module.exports = Verify_user;
