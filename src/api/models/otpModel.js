const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    expires: 40,
  },
  type: {
    type: String,
    enum: ["signup", "resetPassword"],
    required: true,
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
