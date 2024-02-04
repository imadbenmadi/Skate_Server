const { Messages } = require("../models/Database");

const handleContact = async (req, res) => {
    try {
        const { Email, title, message,id } = req.body;
        if (!title || !message) {
            return res.status(409).json({ message: "Missing title or massage" });
        } else if (Email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(Email)) {
            return res.status(409).json({ error: "Invalid Email" });
        }
        try {
            if (Email) {
            await Messages.create({
                Title: title,
                Message: message,
                Date: new Date(),
                Sender_email: Email,
            });
            res.status(200).json({ message: "Message Sent Successfully" });    
            }else if(id){
                await Messages.create({
                    Title: title,
                    Message: message,
                    Date: new Date(),
                    Sender_id: id,
                });
                res.status(200).json({ message: "Message Sent Successfully" });
            }
            else{
                res.status(400).json({ message: "Missing Email or id" });
            }
            
        } catch (err) {
            res.status(400).json({ err });
        }
    } catch (err) {
        res.status(400).json({ err });
    }
};
module.exports = { handleContact };
