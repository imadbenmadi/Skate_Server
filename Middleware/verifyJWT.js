const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECURET, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ error: "Unauthorized: Invalid token" });
        }
        req.userId = decoded.userId;
        next();
    });
};
