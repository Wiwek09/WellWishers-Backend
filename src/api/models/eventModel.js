const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  invites: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Contact",
    },
  ],
  messagedate: {
    type: Date,
    required: true,
  },
  eventdate: {
    type: Date,
    required: true,
  },
  message: {
    type: mongoose.Types.ObjectId,
    ref: "Message",
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
