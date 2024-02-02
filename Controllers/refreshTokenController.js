const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../models/Database");

const handleRefreshToken = (req, res) => {
    try {

        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.status(401).json({ error: "Missing cookies" });
        }
        const refreshToken = cookies.jwt;
        const foundUser = Refresh_tokens.findOne({ token: refreshToken });
        if (!foundUser) return res.status(403).json({ message: "Forbidden" }); //Forbidden
        // evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.userId !== decoded.userId)
                    return res.status(403).json({ message: "Forbidden" });
                const accessToken = jwt.sign(
                    { userId: decoded.userId },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "1h" }
                );
                res.status(200).json({ accessToken });
            }
        );


        
    } catch (err) {
        res.status(400).json({ error: err });
    }
};
module.exports = { handleRefreshToken };
