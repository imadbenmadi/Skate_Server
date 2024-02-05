const jwt = require("jsonwebtoken");
require("dotenv").config();

const Verify_Admin = (req, res, next) => {
    const token = req.cookies.admin_accessToken;
    console.log(token);
    // const secretKey = process.env.ADMIN_ACCESS_TOKEN_SECRET;
    // console.log("Secret Key:", secretKey);
    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ error: "Unauthorized: Invalid token" });
        }
        next();
    });
};
module.exports = Verify_Admin;
