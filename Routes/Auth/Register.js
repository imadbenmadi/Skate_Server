const express = require("express");
const router = express.Router();
const RegisterController = require("../../Controllers/Auth/RegisterController");
// Registration route handler
router.post("/", async (req, res) => {
    const ipAddress = req.ip;

    // Check if the IP address is already blocked and the block has expired
    if (
        registrationAttempts[ipAddress] &&
        registrationAttempts[ipAddress].expirationTime < Date.now()
    ) {
        delete registrationAttempts[ipAddress]; // Unblock the IP address
    }

    try {
        // Call the RegisterController to handle the registration process
        const registrationResult = await RegisterController.handleRegister(req, res);

        // If registration is successful, increment registration attempts and check threshold
        if (registrationResult.success) {
            if (registrationAttempts[ipAddress]) {
                // Increment registration attempts
                registrationAttempts[ipAddress].attempts++;

                // Check if registration attempts threshold is exceeded
                if (registrationAttempts[ipAddress].attempts > 3) {
                    blockIP(ipAddress, 300000); // Block IP address for 5 minutes (300,000 milliseconds)
                    return res
                        .status(429)
                        .json({ error: "Too many registration attempts. Try again later." });
                }
            } else {
                // If IP address is not blocked, set initial registration attempt
                registrationAttempts[ipAddress] = {
                    attempts: 1,
                };
            }
        }

        // Return the result of the registration attempt
        return res.status(registrationResult.statusCode).json(registrationResult.data);
    } catch (error) {
        // Handle any errors that occur during registration
        console.error("Error during registration:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});


module.exports = router;
