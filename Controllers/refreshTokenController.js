const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../models/Database");

const handleRefreshToken = async(req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ error: "Missing cookies" });
        }
        const found_in_DB =await Refresh_tokens.findOne({ token: refreshToken }).exec();
        
        if (!found_in_DB) return res.status(403).json({ message: "Refresh Token not found in the database" }); //Forbidden
        // evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                console.log(found_in_DB.userId !== decoded.userId);
                if (err || found_in_DB.userId != decoded.userId)
                    return res.status(403).json({ message: " fail to virify Jwt , refresh token does not match " });
                const accessToken = jwt.sign(
                    { userId: decoded.userId },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "10s" }
                );
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: "None",
                    secure: true,
                    maxAge: 60 * 60 * 1000,
                });
                res.status(200).json({ accessToken });
            }
        );


        
    } catch (err) {
        res.status(400).json({ error: err });
    }
};
module.exports = { handleRefreshToken };
