const Group = require("../models/groupContactModel");
const validator = require("express-validator");
const AppError = require("../utils/appError.js");

exports.createGroupContact = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newGroupContact = new Group({
      ...req.body,
    });
    const savedGroupContact = await newGroupContact.save();
    res.status(201).json({
      success: true,
      message: "Group Contact Created Successfully",
      savedGroupContact,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGroupContact = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const groupContact = await Group.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!groupContact) return next(new AppError("No Contacts found", 404));
    res.status(200).json({
      success: true,
      message: "Contact Group Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGroupContact = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const groupContact = await Group.findByIdAndDelete(req.params.id);

    if (!groupContact) return next(new AppError("No Contacts found", 404));
    res.status(200).json({
      success: true,
      message: "Group Contact Deleted Successfully",
      groupContact,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllGroupContacts = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const groupContact = await Group.find().populate("contactIds");
    if (!groupContact) return next(new AppError("No Contacts found", 404));
    res.status(200).json({
      success: true,
      groupContact,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleGroupContact = async (req, res, next) => {
  try {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const groupContact = await Group.findById(req.params.id).populate(
      "contactIds"
    );
    if (!groupContact) return next(new AppError("No Contacts found", 404));
    res.status(200).json({
      success: true,
      groupContact,
    });
  } catch (error) {
    next(error);
  }
};
