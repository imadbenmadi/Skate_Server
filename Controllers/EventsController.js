const { Events, Users } = require("../models/Database");
require("dotenv").config();
const getAllEvents = async (req, res) => {
    try {
        const events = await Events.find({});
      return res.status(200).json(events);
    } catch (error) {
     return res.status(500).json({ error: error });
    }
};
const get_Event_ById = async (req, res) => {
    const EventId = req.params.id;

    if (!EventId) {
        return res.status(400).json({ error: "Invalid Event ID." });
    }

    try {
        const Event = await Events.findById(EventId);

        if (!Event) {
            return res.status(404).json({ error: "Event not found." });
        }

      return res.status(200).json(Event);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
};

module.exports = {
    getAllEvents,
    get_Event_ById,
};
