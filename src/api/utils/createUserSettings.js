const Settings = require("../models/settingsModel");

const createUserSettings = async (userId) => {
  try {
    const newSettings = await Settings.create({
      userId: userId,
      language: {
        languageName: "english",
        languageCode: "us-en",
      },
      country: {
        countryName: "nepal",
        countryCode: 977,
      },
      timeformat: "24h",
      timezone: "nepal-time",
      notification: true,
      showNotification: "1 minute before event",
      shareCalenders: "view_only",
    });
    return newSettings;
  } catch (error) {
    console.error("Error creating user settings:", error);
    throw error;
  }
};

module.exports = createUserSettings;
