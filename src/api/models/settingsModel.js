const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
  userId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  ],
  language: {
    languageName: {
      type: String,
    },
    languageCode: {
      type: String,
    },
  },
  country: {
    countryName: {
      type: String,
    },
    countryCode: {
      type: Number,
    },
  },
  timeformat: {
    type: String,
    enum: ["12h", "24h"],
  },
  timezone:{
    type: String,
  },
  notification: {
    type: Boolean,
  },
  showNotificationTime: {
    type: String
  },
  shareCalenders: {
    type: String
  }
});

const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;
