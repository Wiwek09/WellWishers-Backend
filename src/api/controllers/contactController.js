const Contact = require("../models/contactModel.js");
const AppError = require("../utils/appError.js");
const validator = require("express-validator");
const fs = require("fs");
const path = require("path");
const { sharpImage } = require("../utils/sharpImage.js");
const { validationResult } = require("express-validator");

exports.createContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Incoming request body:", req.body);
    console.log("Incoming file:", req.file);

    const uploadsDir = path.join(__dirname, "../../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (req.file) {
      try {
        await sharpImage(req.file, uploadsDir);
      } catch (err) {
        console.error("Error during image processing:", err);
        return res.status(500).json({ error: "Image processing failed" });
      }
    }

    const image = req.file ? req.file.filename : null;
    const newContact = new Contact({
      ...req.body,
      image,
    });
    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      savedContact,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const contact = await Contact.find();
    if (contact.length === 0)
      return next(new AppError("No Contacts found", 404));
    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) return next(new AppError("No Contacts found", 404));

    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Contact Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!contact) return next(new AppError("No Contacts found", 404));
    res.status(200).json({
      success: true,
      message: "Contact Updated Successful",
      contact,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleContact = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) return next(new AppError("No Contacts found", 404));

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    next(error);
  }
};
