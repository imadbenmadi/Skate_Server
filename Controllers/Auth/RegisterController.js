const { Users } = require("../../models/Database");

const handleRegister = async (req, res) => {
    try {
        const { FirstName, LastName, Email, Password, Age, Gender } = req.body;
        if (!FirstName || !LastName || !Email || !Password || !Gender) {
            return res.status(409).json({ message: "Missing Data" });
        } else if (Password.length < 8) {
            return res.status(409).json({
                error: "Password must be at least 8 characters",
            });
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(Email)) {
            return res.status(409).json({ error: "Invalid Email" });
        } else if (Gender != "male" && Gender != "female") {
            return res.status(409).json({
                error: "Invalid Gender , accepted values : male or female",
            });
        }
        const existingUser = await Users.findOne({ Email: Email });
        if (existingUser) {
            res.status(401).json({ error: "Email already exists " });
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
        res.status(400).json({ err });
    }
};

module.exports = { handleRegister };
