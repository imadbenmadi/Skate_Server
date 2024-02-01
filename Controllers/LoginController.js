const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../models/Database");

const handleLogin = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(409).json({ error: "Missing Data" });
        }
        const user = await Users.findOne({ Email: Email });
        if (user && user.Password === Password) {
            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            console.log(accessToken, refreshToken);
            try {
                await Refresh_tokens.create({
                    userId: user._id,
                    token: refreshToken,
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({ error: "Internal Server Error " + err.message });
            }
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                message: "Logged In Successfully",
                jwt: accessToken,
            });
        } else {
            res.status(401).json({
                error: "Username or Password isn't correct",
            });
            console.log("Username or Password isn't correct");
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err });
    }
};
module.exports = { handleLogin };
