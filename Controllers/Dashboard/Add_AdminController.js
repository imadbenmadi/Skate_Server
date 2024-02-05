const bcrypt = require("bcrypt");
const { Admin_data } = require("../../models/Database");

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Function to add an admin to the database
const addAdmin = async (req, res) => {
    try {
        const {adminUser, adminPwd} = req.body;
        const hashedPassword = await hashPassword(adminPwd);

        await Admin_data.create({
            Admin_User_Name: adminUser,
            Admin_Pwd: hashedPassword,
        });
        res.status(201).json({ message: "Admin user saved successfully." });
        console.log("Admin user saved successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
};
module.exports = { addAdmin };