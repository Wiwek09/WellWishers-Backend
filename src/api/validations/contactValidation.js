const validator = require("express-validator");

const validateContactDetails = (isUpdateRequest = false) => {
  const processIfUpdating = (req, field) => {
    if (isUpdateRequest) {
      return req.body[field];
    } else return true;
  };

  return [
    validator
      .body("fullname")
      .if((value, { req }) => processIfUpdating(req, "fullname"))
      .notEmpty()
      .withMessage("Please provide a name.")
      .bail()
      .matches(/^(?![\s]+$)[a-zA-Z\s]*$/)
      .withMessage("Please provide a valid name."),
    validator
      .body("email")
      .if((value, { req }) => processIfUpdating(req, "email"))
      .notEmpty()
      .withMessage("Please provide an email address.")
      .bail()
      .isEmail()
      .withMessage("Please provide a valid email address."),
    validator
      .body("phone")
      .if((value, { req }) => processIfUpdating(req, "phone"))
      .notEmpty()
      .withMessage("Please provide a phone number.")
      .bail()
      .isMobilePhone(["ne-NP"])
      .withMessage("Please provide a valid phone number of Nepal"),
  ];
};

module.exports = { validateContactDetails };
