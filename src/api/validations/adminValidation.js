const validator = require("express-validator");
const { Admin } = require("../models");

const validateAdminDetails = (isUpdateRequest = false) => {
  const processIfUpdating = (req, field) => {
    if (isUpdateRequest) {
      return req.body[field];
    } else return true;
  };

  return [
    validator
      .body("email")
      .if((value, { req }) => processIfUpdating(req, "email"))
      .notEmpty()
      .withMessage("Please provide an email address.")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .custom(async (value) => {
        const admin = await Admin.findOne({ email: value });
        if (admin) {
          throw new Error("This email is already in use.");
        }
      }),
    validator
      .body("password")
      .if((value, { req }) => processIfUpdating(req, "password"))
      .notEmpty()
      .withMessage("Please provide a password")
      .isByteLength({ min: 8, max: 16 })
      .withMessage(
        "Please enter a password of minimum 8 and maximum 16 characters"
      ),
    validator
      .body("passwordConfirm")
      .if((value, { req }) => processIfUpdating(req, "passwordConfirm"))
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password and PasswordConfirm do not match!"),
  ];
};

const checkAdminExists = [
  validator
    .body("email")
    .notEmpty()
    .withMessage("Please enter your email to log in.")
    .isEmail()
    .withMessage("Please enter your valid email.")
    .custom(async (value) => {
      const admin = await Admin.findOne({ email: value });
      if (!admin) {
        throw new Error("This email is not registered as Admin.");
      }
    }),
  validator
    .body("password")
    .notEmpty()
    .withMessage("Please provide a password."),
];

module.exports = { validateAdminDetails, checkAdminExists };
