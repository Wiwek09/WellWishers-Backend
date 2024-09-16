const adminController = require("./adminController");
const authController = require("./authController");
const mailController = require("./mailController");
const contactController = require("./contactController");
const smsController = require("./smsController");
const globalErrorHandler = require("./errorController");
const eventController = require("./eventController");
const groupContactController = require("./groupContactController");
const settingsController = require("./settingsController");
module.exports = {
  adminController,
  authController,
  mailController,
  smsController,
  contactController,
  eventController,
  globalErrorHandler,
  groupContactController,
  settingsController,
};
