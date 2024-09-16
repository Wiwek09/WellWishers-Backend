const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  contactIds: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Contact",
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
