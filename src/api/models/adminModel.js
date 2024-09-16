const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    select: false,
  },
  googleId: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

adminSchema.pre("save", async function (next) {
  // Only hash the password if it is present and modified
  if (this.password && this.isModified("password")) {
    try {
      // Hash the password with cost of 12
      const hashedPassword = await bcrypt.hash(this.password, 12);
      this.password = hashedPassword;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 1000 * 60 * 1000;

  return resetToken;
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
