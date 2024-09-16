const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    maxLength: 10,
    minLength: 10,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  dob: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
  },
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
