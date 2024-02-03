const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users, Refresh_tokens } = require("../models/Database");

const mongoose = require("mongoose");

const handleLogout = async (req, res) => {
    // On the client, also delete the accessToken

    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if (!refreshToken) {
        console.log("No Refresh Cookie found");
        if (accessToken) {
            res.clearCookie("accessToken", {
                httpOnly: true,
                sameSite: "None",
                secure: true,
            });
            return res.status(204).json({ message: "No cookie found" }); // No content
        }

        // Clear both cookies on the client side
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        return res.status(204).json({ message: "No cookie found" });
    }

    // Is refreshToken in db?
    const foundUser = await Refresh_tokens.findOne({ token: refreshToken });

    if (!foundUser) {
        // Clear both cookies on the client side
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        return res.status(204).json({ message: "No cookie found" });
    }

    // Delete refreshToken in db
    try {
        await Refresh_tokens.deleteOne({ token: refreshToken });

        // Clear both cookies on the client side
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        res.status(204).json({ message: "Logged Out Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", err });
    }
};

module.exports = { handleLogout };
