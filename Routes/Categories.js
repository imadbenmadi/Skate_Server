const express = require("express");
const router = express.Router();
const {
    Services_Categories,
    Courses_Categories,
} = require("../models/Database");
const Verify_Admin = require("../Middleware/Verify_Admin");
router.get("/Services", async (req, res) => {
    try {
        const data = await Services_Categories.find({});
        return res.status(200).json({ Categories: data });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

router.post("/Services", async (req, res) => {
    const isAuth = await Verify_Admin(req, res);
    if (isAuth.status == false)
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const data = await Services_Categories.create(req.body.Category_Name);
        return res.status(200).json({ message: "Category Added" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

router.delete("/Services", async (req, res) => {
    const isAuth = await Verify_Admin(req, res);
    if (isAuth.status == false)
        return res.status(401).json({
            message: "Unauthorized: Invalid",
        });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        const data = await Services_Categories.deleteMany({
            Category: req.body.Category_Name,
        });
        return res.status(200).json({ message: "Category Deleted" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
router.get("/Courses", async (req, res) => {
    try {
        const data = await Courses_Categories.find({});
        return res.status(200).json({ Categories: data });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
router.post("/Courses", async (req, res) => {
    const isAuth = await Verify_Admin(req, res);
    if (isAuth.status == false)
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        await Courses_Categories.create(req.body.Category_Name);
        return res.status(200).json({ message: "Category Added" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});
router.delete("/Courses", async (req, res) => {
    const isAuth = await Verify_Admin(req, res);
    if (isAuth.status == false)
        return res.status(401).json({
            message: "Unauthorized: Invalid",
        });
    if (isAuth.status == true && isAuth.Refresh == true) {
        res.cookie("admin_accessToken", isAuth.newAccessToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 60 * 60 * 1000, // 10 minutes in milliseconds
        });
    }
    try {
        await Courses_Categories.deleteMany({
            Category: req.body.Category_Name,
        });
        return res.status(200).json({ message: "Category Deleted" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

module.exports = router;
