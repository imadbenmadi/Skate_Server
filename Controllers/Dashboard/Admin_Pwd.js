const bcrypt = require("bcrypt");
const { Admin_data } = require("../../models/Database");

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Function to add an admin to the database
const addAdmin = async (adminUser, adminPwd) => {
    try {
        const hashedPassword = await hashPassword(adminPwd);

        await Admin_data.create({
            Admin_User_Name: adminUser,
            Admin_Pwd: hashedPassword,
        });

        console.log("Admin user saved successfully.");
    } catch (err) {
        console.error(err);
    }
};

const adminUser = "skate_admin";
const adminPwd = "skate_2024";

// Call addAdmin with provided values
addAdmin(adminUser, adminPwd);
