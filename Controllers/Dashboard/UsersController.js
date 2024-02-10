const { Users } = require("../../models/Database");
const ObjectId = require("mongoose").Types.ObjectId; // Import ObjectId from mongoose
const { Types } = require("mongoose");
const mongoose = require("mongoose");

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
        } else if (FirstName.length < 3) {
            return res
                .status(409)
                .json({ message: "First Name must be more that 3 chars" });
        } else if (LastName.length < 3) {
            return res
                .status(409)
                .json({ message: "Last Name must be more that 3 chars" });
        } else if (FirstName.length > 14) {
            res.status(409).json({
                message: "First Name must be less than 14 chars",
            });
        } else if (LastName.length > 14) {
            res.status(409).json({
                message: "LastName must be less than 14 chars",
            });
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
};
const handle_modify_User = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const {
            id,
            CoursesToAdd,
            CoursesToRemove,
            ServicesToAdd,
            ServicesToRemove,
            NotificationsToAdd,
        } = req.body;
        if (!id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const userToUpdate = await Users.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ error: "User not found." });
        }

        // Extract fields that can be modified from the request body
        const {
            FirstName,
            LastName,
            Email,
            Password,
            Age,
            Gender,
            Telephone,
            IsEmailVerified,
        } = req.body;

        // Update individual fields
        if (FirstName) {
            userToUpdate.FirstName = FirstName;
        }
        if (LastName) {
            userToUpdate.LastName = LastName;
        }
        if (Email) {
            userToUpdate.Email = Email;
        }
        if (Password) {
            userToUpdate.Password = Password;
        }
        if (Age) {
            userToUpdate.Age = Age;
        }
        if (Gender) {
            userToUpdate.Gender = Gender;
        }
        if (Telephone) {
            userToUpdate.Telephone = Telephone;
        }
        if (typeof IsEmailVerified === "boolean") {
            userToUpdate.IsEmailVerified = IsEmailVerified;
        }

        // Update Courses
        if (CoursesToAdd && CoursesToAdd.length > 0) {
            const coursesToAddUnique = CoursesToAdd.filter(
                (course) => !userToUpdate.Courses.includes(course)
            );
            userToUpdate.Courses.push(...coursesToAddUnique);
        }
        // console.log("courses to remove : ", CoursesToRemove);
        // console.log("serveses to remove : ", ServicesToRemove);
        if (CoursesToRemove && CoursesToRemove.length > 0) {
            try {
                for (const courseId of CoursesToRemove) {
                    // Find the index of the courseId in userToUpdate.Courses
                    const indexToRemove = userToUpdate.Courses.findIndex(
                        (course) => String(course) === courseId
                    );

                    // Remove the courseId if found
                    if (indexToRemove !== -1) {
                        userToUpdate.Courses.splice(indexToRemove, 1);
                    } else {}
                }
            } catch (error) {
                console.error("Error removing courses:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        }

        // Update Services
        if (ServicesToAdd && ServicesToAdd.length > 0) {
            const servicesToAddUnique = ServicesToAdd.filter(
                (service) => !userToUpdate.Services.includes(service)
            );
            userToUpdate.Services.push(...servicesToAddUnique);
        }
        if (ServicesToRemove && ServicesToRemove.length > 0) {
            try {
                for (const serviceId of ServicesToRemove) {
                    // Find the index of the serviceId in userToUpdate.Services
                    const indexToRemove = userToUpdate.Services.findIndex(
                        (service) => String(service) === serviceId
                    );

                    // Remove the serviceId if found
                    if (indexToRemove !== -1) {
                        userToUpdate.Services.splice(indexToRemove, 1);
                    } else {}
                }
            } catch (error) {
                console.error("Error removing services:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        }


        // Update Notifications
        if (NotificationsToAdd && NotificationsToAdd.length > 0) {
            userToUpdate.Notifications.push(...NotificationsToAdd);
        }

        // Save the updated user
        await userToUpdate.save();

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const getAllUsers = async (req, res) => {
    const token = req.cookies.admin_accessToken;

    if (!token)
        return res.status(401).json({ error: "Unauthorized: Token missing" });

    if (!Verify_Admin(token))
        return res.status(401).json({ error: "Unauthorized: Invalid token" });

    try {
        const users = await Users.find({}, { Notifications: 0 }); // Exclude the Notifications field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

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
        const user = await Users.findById(id, { Notifications: 0 }); // Exclude the Notifications field
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {
    handle_add_User,
    handle_delete_User,
    handle_modify_User,
    getAllUsers,
    get_user,
};
