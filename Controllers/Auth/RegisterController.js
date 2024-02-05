const { Users } = require("../../models/Database");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generateVerificationCode = () => {
    const code = crypto.randomInt(10000000, 99999999);
    return code.toString();
};
const sendVerificationEmail = (Email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // Replace 'http://your-api-base-url' with your actual API base URL
    const verificationLink = `http://http://localhost:3000/verify/${verificationToken}`;

    const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: "Skate | Email Verification",
        text: `Click the following link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
}
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
            const verificationToken = generateVerificationCode();
            const newUser = new Users({
                FirstName: FirstName,
                LastName: LastName,
                Email: Email,
                Telephone: Telephone,
                Password: Password,
                Age: Age,
                Gender: Gender,
                EmailVerificationToken: verificationToken,
            });
            await newUser.save();
            sendVerificationEmail(Email, verificationToken);
            res.status(200).json({ message: "Account Created Successfully" });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
};

module.exports = { handleRegister };
