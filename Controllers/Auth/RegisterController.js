const { Users } = require("../../models/Database");

const handleRegister = async (req, res) => {
    try {
        const { FirstName, LastName, Email, Password, Age, Gender, Telephone } =
            req.body;
        
        const isValidTelephone = /^(0)(5|6|7)[0-9]{8}$/.test(Telephone);

        if (
            !FirstName ||
            !LastName ||
            !Email ||
            !Password ||
            !Gender ||
            !Telephone
        ) {
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
        } else if (Telephone.length < 9) {
            return res.status(409).json({
                error: "Telephone must be at least 9 characters",
            });
        } else if (!isValidTelephone) {
            return res.status(409).json({
                error: "Telephone must be a number",
            });
        } else if (Age && isNaN(Age)) {
            return res.status(409).json({ error: "Age must be a number" });
        }
        const existingUser = await Users.findOne({ Email: Email });
        if (existingUser) {
            res.status(401).json({ error: "Email already exists " });
        } else {
            const newUser = new Users({
                FirstName: FirstName,
                LastName: LastName,
                Email: Email,
                Telephone: Telephone,
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
