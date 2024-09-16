const Settings = require("../models/settingsModel");
const { validationResult } = require("express-validator");

const getSettings = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const settings = await Settings.findOne({ userId: userId });

    if (!settings)
      return res.status(400).json({
        status: "Failed",
        message: "Settings of specified user not found",
      });
    res.status(200).json({ status: "Success", settings });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: "Unable to fetch" });
    next(res);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const {
      language: { languageName, languageCode },
      country: { countryName, countryCode },
      timeformat,
      timezone,
      notification,
      showNotificationTime,
      shareCalenders,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const settings = await Settings.findOneAndUpdate(
      {
        userId: { $in: [userId] },
      },
      {
        $set: {
          "language.languageName": languageName,
          "language.languageCode": languageCode,
          "country.countryName": countryName,
          "country.countryCode": countryCode,
          timeformat,
          timezone,
          notification,
          showNotificationTime,
          shareCalenders,
        },
      },
      { new: true, runValidators: true }
    );

    if (!settings) {
      console.log("Error Thrown:");
      return res.status(404).json({ message: "Settings not found" });
    }
    res.status(200).json({
      status: "Success",
      settings,
    });
  } catch (error) {
    res.status(400).json({ status: "Failed", message: "Unable to fetch data" });
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
