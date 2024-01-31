const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../../models/Database");

const handleLogin = async (req, res) => {
    try {
        const { email, Password } = req.body;
        if (!email || !Password) {
            return res.status(409).json({ error: "Missing Data" });
        }
        const user = await Users.findOne({ email: email });
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
            await Refresh_tokens.create({
                userId: user._id,
                token: refreshToken,
            });
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
        res.status(400).json({ error: err });
    }
};
module.exports = { handleLogin };
