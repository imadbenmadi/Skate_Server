const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { Admin_data, Refresh_tokens } = require("../../models/Database");
// Function to compare passwords
const comparePasswords = async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
};

const handleLogin = async (req, res) => {
    try {
        const { Name, Password } = req.body;
        if (!Name || !Password) {
            return res.status(409).json({ error: "Missing Data" });
        }
        const Admin_in_Db = await Admin_data.findOne({ Admin_User_Name: Name });
        const passwordsMatch = await comparePasswords(
            Password,
            Admin_in_Db.Admin_Pwd
        );
        if (!passwordsMatch) {
            return res
                .status(401)
                .json({ error: "Invalid username or password." });
        }

        if (Admin_in_Db && passwordsMatch) {
            const accessToken = jwt.sign(
                { adminId: Admin_in_Db._id },
                process.env.ADMIN_ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
                { adminId: Admin_in_Db._id },
                process.env.ADMIN_REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            
            try {
                await Refresh_tokens.create({
                    userId: Admin_in_Db._id,
                    token: refreshToken,
                });
            } catch (err) {
                res.status(500).json({
                    error: "Internal Server Error " + err.message,
                });
            }
            res.cookie("admin_accessToken", accessToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 60 * 60 * 1000,
            });
            res.cookie("admin_refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            if (req.cookies.accessToken) {
                res.clearCookie("accessToken");
            }
            if (req.cookies.refreshToken) {
                res.clearCookie("refreshToken");
            }
            res.status(200).json({
                message: "Admin Logged In Successfully",
                jwt: accessToken,
            });
        } else {
            res.status(401).json({
                error: "Name or Password isn't correct",
            });
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
};
module.exports = { handleLogin };
