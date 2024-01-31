const express = require("express");
const router = express.Router();
const { Users, UserActions } = require("../../models/Db");

router.post("/", async (req, res) => {
    try {
        const { FirstName, LastName, Email, Password, Age, Gender } =
            req.body;
        if (
            !FirstName ||
            !LastName ||
            !Email ||
            !Password 
        ) {
            return res.status(409).json({ message: "Missing Data" });
        }
        const existingUser = await Users.findOne({ Email: Email });
        if (existingUser) {
            res.sendStatus(400).json({ error: "Email already exists " });
        } else {
            const newUser = new Users({
                FirstName: FirstName,
                LastName: LastName,
                Email: Email,
                Password: Password,
                Age: Age,
                Gender: Gender,
            });
            await newUser.save();
            res.status(200).json({ message: "Account Created Successfully" });
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

module.exports = router;
