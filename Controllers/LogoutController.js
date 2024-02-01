const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../models/Database");

const mongoose = require("mongoose");
const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) {
        console.log("No cookie found");
        return res.status(204).json({ lmessage: "No cookie found" }); //No content
    } 
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = Refresh_tokens.findOne({ token: refreshToken });
    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    try {
        await Refresh_tokens.deleteOne({ token: refreshToken });
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        res.status(204).json({ message: "Logged Out Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error", err });
    }
};

module.exports = { handleLogout };
