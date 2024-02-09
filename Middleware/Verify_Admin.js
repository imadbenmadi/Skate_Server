require("dotenv").config();
const jwt = require("jsonwebtoken");

const Verify_Admin = (admin_accessToken) => {
    const secretKey = process.env.ADMIN_ACCESS_TOKEN_SECRET;
    if (!admin_accessToken) return false;
    try {
        const decoded = jwt.verify(admin_accessToken, secretKey);
        return true;
    } catch (err) {
        return false;
    }
};
module.exports = Verify_Admin;
