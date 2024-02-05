const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ error: "Unauthorized: Invalid token" });
        }
        req.userId = decoded.userId;
        next();
    });
};
module.exports = verifyToken;
