const { Users } = require("../../models/Database");

const handle_check = async (req, res)=>{
    try {
        const userId = req.body.userId;
        const user = await Users.findById(userId).select("IsEmailVerified");
        if (!user) {
            res.status(404).json({ error: "User Not Found" });
        }
        res.status(200).json({ IsEmailVerified: user.IsEmailVerified });
    } catch (error) {
        res.status(500).json({error: "internal server Error"})
    }
}
module.exports = { handle_check };