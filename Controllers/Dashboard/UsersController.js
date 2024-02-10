const { Users } = require("../../models/Database");

const Verify_Admin = require("../../Middleware/Verify_Admin");

const handle_add_User = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

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
            return res
                .status(409)
                .json({ error: "Password must be at least 8 characters" });
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(Email)) {
            return res.status(409).json({ error: "Invalid Email" });
        } else if (Gender !== "male" && Gender !== "female") {
            return res.status(409).json({
                error: "Invalid Gender, accepted values: male or female",
            });
        } else if (Telephone.length < 9) {
            return res
                .status(409)
                .json({ error: "Telephone must be at least 9 characters" });
        } else if (!isValidTelephone) {
            return res
                .status(409)
                .json({ error: "Telephone must be a number" });
        } else if (Age && isNaN(Age)) {
            return res.status(409).json({ error: "Age must be a number" });
        }
        const existingUser = await Users.findOne({ Email: Email });
        if (existingUser) {
            return res.status(401).json({ error: "Email already exists" });
        }
        const newUser = new Users({
            FirstName: FirstName,
            LastName: LastName,
            Email: Email,
            Telephone: Telephone,
            Password: Password,
            Age: Age,
            Gender: Gender,
        });
        res.status(200).json({
            message: "Account Created Successfully",
            _id: newUser._id,
            Date: new Date(),
        });
        await newUser.save();
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};
const handle_delete_User = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "User ID is required." });
        }
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        await Users.findByIdAndDelete(id);
        res.status(200).json({ message: "User Deleted Successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}
const getAllUsers = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}
const get_user = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required." });
        }
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}
module.exports = { handle_add_User, handle_delete_User, getAllUsers };
